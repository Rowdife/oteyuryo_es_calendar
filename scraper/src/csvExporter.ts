import * as fs from 'fs';
import * as path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import { CompanyData } from './types';

/**
 * CSVヘッダー定義（要件で指定された順序）
 */
const CSV_HEADERS = [
  { id: 'rank', title: 'rank' },
  { id: 'company_name', title: 'company_name' },
  { id: 'ticker', title: 'ticker' },
  { id: 'market_cap', title: 'market_cap' },
  { id: 'listing_market', title: 'listing_market' },
  { id: 'industry', title: 'industry' },
  { id: 'foundation_year', title: 'foundation_year' },
  { id: 'employees', title: 'employees' },
  { id: 'is_newgrad_active', title: 'is_newgrad_active' },
  { id: 'hq_location', title: 'hq_location' },
  { id: 'official_site_url', title: 'official_site_url' },
  { id: 'official_career_url', title: 'official_career_url' },
  { id: 'logo_image_url', title: 'logo_image_url' },
  { id: 'revenue', title: 'revenue' },
  { id: 'operating_income', title: 'operating_income' },
  { id: 'notes', title: 'notes' },
];

/**
 * 企業データをCSVファイルにエクスポート
 * @param companies 企業データの配列
 * @param outputPath 出力先パス
 */
export async function exportToCSV(
  companies: CompanyData[],
  outputPath: string
): Promise<void> {
  // 出力ディレクトリが存在しない場合は作成
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // CSV Writer の設定
  const csvWriter = createObjectCsvWriter({
    path: outputPath,
    header: CSV_HEADERS,
    encoding: 'utf8',
  });

  // CSV書き込み
  await csvWriter.writeRecords(companies);

  console.log(`Exported ${companies.length} companies to ${outputPath}`);
}
