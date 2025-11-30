import * as fs from 'fs';
import * as path from 'path';
import { parseRankingPage, extractMarketCategory } from '../src/parser';

describe('parseRankingPage', () => {
  let sampleHtml: string;

  beforeAll(() => {
    // テスト用のサンプルHTMLを読み込み
    const fixturePath = path.join(__dirname, 'fixtures', 'sample-page.html');
    sampleHtml = fs.readFileSync(fixturePath, 'utf-8');
  });

  test('should parse sample HTML and return correct number of companies', () => {
    const result = parseRankingPage(sampleHtml);

    expect(result.companies).toHaveLength(3);
  });

  test('should extract correct company data from first entry', () => {
    const result = parseRankingPage(sampleHtml);
    const firstCompany = result.companies[0];

    expect(firstCompany.rank).toBe(1);
    expect(firstCompany.company_name).toBe('トヨタ自動車');
    expect(firstCompany.ticker).toBe('7203');
    expect(firstCompany.market_cap).toBe('50228060122800');
    expect(firstCompany.listing_market).toBe('Prime');
  });

  test('should return empty fields for data not available in ranking page', () => {
    const result = parseRankingPage(sampleHtml);
    const firstCompany = result.companies[0];

    // ランキングページには存在しない情報
    expect(firstCompany.industry).toBe('');
    expect(firstCompany.foundation_year).toBe('');
    expect(firstCompany.employees).toBe('');
    expect(firstCompany.is_newgrad_active).toBe('');
    expect(firstCompany.hq_location).toBe('');
    expect(firstCompany.official_site_url).toBe('');
    expect(firstCompany.official_career_url).toBe('');
    expect(firstCompany.logo_image_url).toBe('');
    expect(firstCompany.revenue).toBe('');
    expect(firstCompany.operating_income).toBe('');
    expect(firstCompany.notes).toBe('');
  });

  test('should parse all three companies correctly', () => {
    const result = parseRankingPage(sampleHtml);

    expect(result.companies[0].company_name).toBe('トヨタ自動車');
    expect(result.companies[1].company_name).toBe('三菱ＵＦＪフィナンシャル・グループ');
    expect(result.companies[2].company_name).toBe('ソニーグループ');

    expect(result.companies[0].ticker).toBe('7203');
    expect(result.companies[1].ticker).toBe('8306');
    expect(result.companies[2].ticker).toBe('6758');
  });

  test('should handle missing or invalid HTML gracefully', () => {
    const emptyHtml = '<html><body></body></html>';
    const result = parseRankingPage(emptyHtml);

    expect(result.companies).toHaveLength(0);
  });
});

describe('extractMarketCategory', () => {
  test('should convert MPR to Prime', () => {
    expect(extractMarketCategory(['MPR'])).toBe('Prime');
  });

  test('should convert MST to Standard', () => {
    expect(extractMarketCategory(['MST'])).toBe('Standard');
  });

  test('should convert MGR to Growth', () => {
    expect(extractMarketCategory(['MGR'])).toBe('Growth');
  });

  test('should convert TP to Prime (default for top companies)', () => {
    expect(extractMarketCategory(['TP'])).toBe('Prime');
  });

  test('should convert TPF to Prime (Prime foreign companies)', () => {
    expect(extractMarketCategory(['TPF'])).toBe('Prime');
  });

  test('should handle array with multiple codes - MPR priority', () => {
    expect(extractMarketCategory(['MPR', 'TP'])).toBe('Prime');
    expect(extractMarketCategory(['TP', 'MPR'])).toBe('Prime');
  });

  test('should handle complex array with multiple codes', () => {
    expect(extractMarketCategory(['FK', 'MPR', 'S', 'TP'])).toBe('Prime');
  });

  test('should prioritize MST over TP', () => {
    expect(extractMarketCategory(['MST', 'TP'])).toBe('Standard');
  });

  test('should prioritize MGR over TP', () => {
    expect(extractMarketCategory(['MGR', 'TP'])).toBe('Growth');
  });

  test('should return empty string for unknown market code', () => {
    expect(extractMarketCategory(['UNKNOWN'])).toBe('');
  });

  test('should return empty string for empty array', () => {
    expect(extractMarketCategory([])).toBe('');
  });

  test('should handle undefined gracefully', () => {
    expect(extractMarketCategory(undefined as any)).toBe('');
  });
});
