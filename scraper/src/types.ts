/**
 * 企業データの型定義
 * CSV出力時のスキーマと完全に対応
 */
export interface CompanyData {
  rank: number;                    // ランキング順位 (1-200)
  company_name: string;            // 企業名（日本語）
  ticker: string;                  // 証券コード
  market_cap: string;              // 時価総額（文字列）
  listing_market: string;          // 市場区分 (Prime/Standard/Growth)
  industry: string;                // 業種（現時点では空欄でOK）
  foundation_year: string;         // 設立年（現時点では空欄でOK）
  employees: string;               // 従業員数（現時点では空欄でOK）
  is_newgrad_active: string;       // 新卒採用の有無（現時点では空欄でOK）
  hq_location: string;             // 本社所在地（現時点では空欄でOK）
  official_site_url: string;       // 公式サイトURL（現時点では空欄でOK）
  official_career_url: string;     // 採用サイトURL（現時点では空欄でOK）
  logo_image_url: string;          // ロゴ画像URL（現時点では空欄でOK）
  revenue: string;                 // 売上高（現時点では空欄でOK）
  operating_income: string;        // 営業利益（現時点では空欄でOK）
  notes: string;                   // 備考（現時点では空欄でOK）
}

/**
 * スクレイピング設定
 */
export interface ScraperConfig {
  baseUrl: string;
  targetCompanyCount: number;
  companiesPerPage: number;
  requestDelayMs: number;  // サーバー負荷軽減のための待機時間
}

/**
 * 1ページ分のパース結果
 */
export interface PageParseResult {
  companies: CompanyData[];
  hasNextPage: boolean;
}
