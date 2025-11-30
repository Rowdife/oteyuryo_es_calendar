export interface CompanyDeadline {
  id: string;
  company_name: string;
  ticker: string;
  deadline_date: string;  // YYYY-MM-DD
  deadline_time: string;  // HH:MM
  event_type: string;     // 本選考ES / インターン
  tags: string[];         // タグの配列
  official_url: string;   // 公式サイトURL
}
