import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

const SAMPLE_DATA = [{"state":"Florida","carrier":"Citizens Property Insurance","action_type":"Market Conduct Exam","issued_date":"2026-02-14","penalty_amount":2400000,"license_impact":"None","consumers_affected":48000,"action_status":"Final","doi_case_number":"2026-FL-0042"},{"state":"California","carrier":"PURE Insurance","action_type":"Cease and Desist","issued_date":"2026-01-28","penalty_amount":850000,"license_impact":"Restricted","consumers_affected":3200,"action_status":"Active","doi_case_number":"2026-CA-0018"},{"state":"Texas","carrier":"AmTrust Financial","action_type":"License Suspension","issued_date":"2026-03-01","penalty_amount":1200000,"license_impact":"Suspended","consumers_affected":12400,"action_status":"Active","doi_case_number":"2026-TX-0067"}];

function getStats(data: Record<string, unknown>[]) {
  if (!data || data.length === 0) return {};
  const numericKeys = Object.keys(data[0]).filter(k => typeof data[0][k] === "number");
  const stats: Record<string, unknown> = { total_records: data.length };
  numericKeys.slice(0, 2).forEach(k => {
    const avg = data.reduce((s, r) => s + (Number(r[k]) || 0), 0) / data.length;
    stats[`avg_${k}`] = Math.round(avg * 100) / 100;
  });
  return stats;
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  
  let data = SAMPLE_DATA as Record<string, unknown>[];
  if (q) {
    data = data.filter(r =>
      Object.values(r).some(v => String(v).toLowerCase().includes(q.toLowerCase()))
    );
  }
  
  return NextResponse.json({
    data,
    stats: getStats(data),
    refreshed: new Date().toISOString()
  });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const data = SAMPLE_DATA as Record<string, unknown>[];
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const csv = [
    headers.join(","),
    ...data.map(r => headers.map(h => String(r[h] ?? "")).join(","))
  ].join("\n");
  
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=regaction-export.csv`
    }
  });
}
