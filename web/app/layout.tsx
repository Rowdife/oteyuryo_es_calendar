import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "人気企業ESカレンダー",
  description: "時価総額上位200社のES締切情報をまとめたカレンダー",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
