import * as cheerio from 'cheerio';
import { CompanyData, PageParseResult } from './types';

/**
 * 市場区分コードを人間が読める形式に変換
 * @param marketCodes LISS_MKTN 配列
 * @returns Prime/Standard/Growth または空文字列
 *
 * 注：LISS_MKTN配列には複数のコードが含まれることがある
 * 例: ["MPR","TP"], ["TP"], ["FK","MPR","S","TP"]
 * 優先順位: MPR > MST > MGR > TP（デフォルトでPrime）
 */
export function extractMarketCategory(marketCodes: string[] | undefined): string {
  if (!marketCodes || marketCodes.length === 0) {
    return '';
  }

  // 配列内に明示的な市場区分コードがあるかチェック（優先順位順）
  if (marketCodes.includes('MPR')) {
    return 'Prime';
  }
  if (marketCodes.includes('MST')) {
    return 'Standard';
  }
  if (marketCodes.includes('MGR')) {
    return 'Growth';
  }

  // TP（東証）やTPF（東証プライム外国）もPrime市場として扱う
  if (marketCodes.includes('TP') || marketCodes.includes('TPF')) {
    return 'Prime';
  }

  return '';
}

/**
 * 日経ランキングページのHTMLから企業情報を抽出
 * @param html ページのHTML文字列
 * @returns パース結果（企業リストとページネーション情報）
 */
export function parseRankingPage(html: string): PageParseResult {
  try {
    const $ = cheerio.load(html);

    // __NEXT_DATA__ スクリプトタグからJSONデータを抽出
    const nextDataScript = $('#__NEXT_DATA__').html();

    if (!nextDataScript) {
      console.warn('__NEXT_DATA__ script not found in HTML');
      return { companies: [], hasNextPage: false };
    }

    const jsonData = JSON.parse(nextDataScript);
    const dataLists = jsonData?.props?.pageProps?.data?.data_lists;

    if (!Array.isArray(dataLists)) {
      console.warn('data_lists not found or not an array');
      return { companies: [], hasNextPage: false };
    }

    // 各企業データをCompanyData型に変換
    const companies: CompanyData[] = dataLists.map((item: any) => ({
      rank: item.RANK || 0,
      company_name: item.SOBA_NAME || '',
      ticker: item.BICD || '',
      market_cap: item.MKCP || '',
      listing_market: extractMarketCategory(item.LISS_MKTN),
      industry: '',
      foundation_year: '',
      employees: '',
      is_newgrad_active: '',
      hq_location: '',
      official_site_url: '',
      official_career_url: '',
      logo_image_url: '',
      revenue: '',
      operating_income: '',
      notes: '',
    }));

    return {
      companies,
      hasNextPage: false, // ページネーションは後で実装
    };
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return { companies: [], hasNextPage: false };
  }
}
