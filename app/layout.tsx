import type { Metadata } from "next";
import "./globals.css";
import AgentWidget from '@/components/AgentWidget';
export const metadata: Metadata = {
  title: "RegAction — Regulatory Action Monitor — State Insurance Depts",
  description: "Unified regulatory action feed from all 50 state insurance departments — cease and desist orders, license suspensions, a",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "#0A0505", color: "#E8EAF0", fontFamily: "monospace", margin: 0 }}>
        {children}
            <AgentWidget />
    </body>
    </html>
  );
}
