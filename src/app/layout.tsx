import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/shared/components/Toast";

export const metadata: Metadata = {
  title: "Planning Poker",
  description: "Real-time planning poker for agile teams. Estimate story points together.",
  keywords: ["planning poker", "scrum", "agile", "story points", "estimation"],
  openGraph: {
    title: "Planning Poker",
    description: "Real-time planning poker for agile teams.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
