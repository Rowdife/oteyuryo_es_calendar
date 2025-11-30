import axios from 'axios';
import { parseRankingPage } from './parser';
import { CompanyData, ScraperConfig } from './types';
import { exportToCSV } from './csvExporter';

/**
 * デフォルトのスクレイピング設定
 */
const DEFAULT_CONFIG: ScraperConfig = {
  baseUrl: 'https://www.nikkei.com/marketdata/ranking-jp/market-cap-high/',
  targetCompanyCount: 200,
  companiesPerPage: 30,
  requestDelayMs: 1000, // サーバー負荷軽減のため1秒待機
};

/**
 * 指定ミリ秒待機するユーティリティ
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 指定したページ番号のHTMLを取得
 */
async function fetchPage(pageNumber: number, config: ScraperConfig): Promise<string> {
  const url = `${config.baseUrl}?page=${pageNumber}`;
  console.log(`Fetching page ${pageNumber}: ${url}`);

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching page ${pageNumber}:`, error);
    throw error;
  }
}

/**
 * 複数ページから企業情報を収集
 */
async function scrapeAllPages(config: ScraperConfig): Promise<CompanyData[]> {
  const allCompanies: CompanyData[] = [];
  const totalPages = Math.ceil(config.targetCompanyCount / config.companiesPerPage);

  console.log(`Starting scraping: Target ${config.targetCompanyCount} companies across ${totalPages} pages`);

  for (let page = 1; page <= totalPages; page++) {
    // サーバー負荷軽減のため待機（1ページ目は待たない）
    if (page > 1) {
      await delay(config.requestDelayMs);
    }

    try {
      const html = await fetchPage(page, config);
      const result = parseRankingPage(html);

      console.log(`Page ${page}: Found ${result.companies.length} companies`);
      allCompanies.push(...result.companies);

      // 目標企業数に達したら終了
      if (allCompanies.length >= config.targetCompanyCount) {
        console.log(`Reached target of ${config.targetCompanyCount} companies`);
        break;
      }
    } catch (error) {
      console.error(`Failed to scrape page ${page}, continuing...`);
      // エラーが発生しても次のページを試みる
    }
  }

  // 目標数を超えている場合は切り詰める
  return allCompanies.slice(0, config.targetCompanyCount);
}

/**
 * メイン処理：スクレイピング実行してCSV出力
 */
async function main() {
  try {
    console.log('=== Nikkei Market Cap Ranking Scraper ===\n');

    // スクレイピング実行
    const companies = await scrapeAllPages(DEFAULT_CONFIG);

    console.log(`\nTotal companies scraped: ${companies.length}`);

    // CSV出力
    const outputPath = './output/popular_companies.csv';
    await exportToCSV(companies, outputPath);

    console.log(`\n✓ Successfully exported to ${outputPath}`);
  } catch (error) {
    console.error('Scraping failed:', error);
    process.exit(1);
  }
}

// スクリプトとして直接実行された場合のみmain()を呼ぶ
if (require.main === module) {
  main();
}

export { scrapeAllPages, fetchPage };
