import type { Metadata } from "next";
import "./globals.css";

const siteName = "大手企業・優良企業ESカレンダー";
const siteDescription =
  "大手企業・優良企業のES（エントリーシート）締切日を一覧・カレンダー形式で確認できる就活生向けサービス。26卒・27卒対応。ホワイト企業や人気企業のES締切を見逃さずに管理しよう。";
const siteUrl = "https://es-calendar.example.com"; // TODO: 本番URLに変更

export const metadata: Metadata = {
  title: {
    default: `${siteName} | 26卒・27卒 ES締切一覧`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "大手企業 ES 締切",
    "優良企業 ES カレンダー",
    "26卒 ES 締切 一覧",
    "27卒 ES 締切",
    "ホワイト企業 ES",
    "新卒 ES 締切",
    "エントリーシート 締切",
    "就活 ES カレンダー",
    "人気企業 ES",
    "ES締切日 まとめ",
    "就活スケジュール",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} | 大手・優良企業のES締切を一覧で確認`,
    description: siteDescription,
    images: [
      {
        url: "/og-image.png", // TODO: OGP画像を作成して配置
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | 26卒・27卒 ES締切一覧`,
    description: siteDescription,
    images: ["/og-image.png"], // TODO: OGP画像を作成して配置
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // TODO: 各サービスの認証コードを設定
    // google: "Google Search Console認証コード",
    // yahoo: "Yahoo認証コード",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <a href="#main-content" className="skip-link">
          メインコンテンツへスキップ
        </a>
        {children}
      </body>
    </html>
  );
}
