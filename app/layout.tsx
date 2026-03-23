import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Workplace Chat — 職場チャット",
  description: "日本語 ⇄ English 自動翻訳チャット for Filipino workers in Japan",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
