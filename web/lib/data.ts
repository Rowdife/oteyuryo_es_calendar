import fs from 'fs';
import path from 'path';
import { Posting, TransferType } from '@/types/posting';

// マスタデータのキャッシュ
let tagCache: Map<string, string> | null = null;
let industryCache: Map<string, string> | null = null;
let benefitCache: Map<string, string> | null = null;
let postingsCache: Posting[] | null = null;

/**
 * tags.csvからタグマスタを読み込む
 */
function loadTagMaster(): Map<string, string> {
  if (tagCache) return tagCache;

  const filePath = path.join(process.cwd(), 'data', 'tags.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const lines = fileContent.trim().split('\n');
  tagCache = new Map<string, string>();

  lines.slice(1).forEach((line) => {
    const [id, name] = line.split(',');
    if (id && name) {
      tagCache!.set(id.trim(), name.trim());
    }
  });

  return tagCache;
}

/**
 * industries.csvから業界マスタを読み込む
 */
function loadIndustryMaster(): Map<string, string> {
  if (industryCache) return industryCache;

  const filePath = path.join(process.cwd(), 'data', 'industries.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const lines = fileContent.trim().split('\n');
  industryCache = new Map<string, string>();

  lines.slice(1).forEach((line) => {
    const [id, name] = line.split(',');
    if (id && name) {
      industryCache!.set(id.trim(), name.trim());
    }
  });

  return industryCache;
}

/**
 * benefits.csvから福利厚生マスタを読み込む
 */
function loadBenefitMaster(): Map<string, string> {
  if (benefitCache) return benefitCache;

  const filePath = path.join(process.cwd(), 'data', 'benefits.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const lines = fileContent.trim().split('\n');
  benefitCache = new Map<string, string>();

  lines.slice(1).forEach((line) => {
    const [id, name] = line.split(',');
    if (id && name) {
      benefitCache!.set(id.trim(), name.trim());
    }
  });

  return benefitCache;
}

/**
 * tag_idsをタグ名の配列に変換
 */
function resolveTagIds(tagIds: string): string[] {
  const tagMaster = loadTagMaster();
  return tagIds
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id !== '')
    .map((id) => tagMaster.get(id) || id)
    .filter((name) => name !== '');
}

/**
 * benefit_idsを福利厚生名の配列に変換
 */
function resolveBenefitIds(benefitIds: string): string[] {
  const benefitMaster = loadBenefitMaster();
  return benefitIds
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id !== '')
    .map((id) => benefitMaster.get(id) || id)
    .filter((name) => name !== '');
}

/**
 * industry_idを業界名に変換
 */
function resolveIndustryId(industryId: string): string {
  const industryMaster = loadIndustryMaster();
  return industryMaster.get(industryId.trim()) || '';
}

/**
 * CSVを読み込んでPosting一覧を返す（キャッシュ付き）
 */
export function getPostings(): Posting[] {
  if (postingsCache) return postingsCache;

  const filePath = path.join(process.cwd(), 'data', 'es_deadlines.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const lines = fileContent.trim().split('\n');
  const headers = lines[0].split(',');

  const postings = lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const data: Record<string, string> = {};

    headers.forEach((header, index) => {
      data[header] = values[index] || '';
    });

    return {
      id: data.id,
      company_name: data.company_name,
      ticker: data.ticker,
      posting_title: data.posting_title || data.event_type,
      deadline_date: data.deadline_date,
      deadline_time: data.deadline_time,
      event_type: data.event_type,
      industry_id: data.industry_id || '',
      industry: resolveIndustryId(data.industry_id || ''),
      job_type: data.job_type || '',
      salary: parseInt(data.salary, 10) || 0,
      has_bonus: data.has_bonus === 'true',
      salary_notes: data.salary_notes || '',
      transfer_type: (data.transfer_type || '全国転勤') as TransferType,
      annual_paid_leave_days: parseInt(data.annual_paid_leave_days, 10) || 0,
      benefits: resolveBenefitIds(data.benefit_ids || ''),
      tags: resolveTagIds(data.tag_ids || ''),
      official_url: data.official_url,
      last_verified_at: data.last_verified_at || new Date().toISOString(),
      target_year: data.target_year || undefined,
    };
  });

  // 締切日でソート（昇順：早い日付から）
  postingsCache = postings.sort((a, b) => {
    const dateA = a.deadline_date;
    const dateB = b.deadline_date;
    return dateA.localeCompare(dateB);
  });

  return postingsCache;
}

/**
 * IDでPostingを取得
 */
export function getPostingById(id: string): Posting | null {
  const postings = getPostings();
  return postings.find((p) => p.id === id) || null;
}

/**
 * 同じ企業の他のPostingを取得
 */
export function getPostingsByCompany(
  companyName: string,
  excludeId?: string
): Posting[] {
  const postings = getPostings();
  return postings.filter(
    (p) => p.company_name === companyName && p.id !== excludeId
  );
}

/**
 * 全タグを取得（tags.csvから）
 */
export function getAllTags(): string[] {
  const tagMaster = loadTagMaster();
  return Array.from(tagMaster.values()).sort();
}

/**
 * 全業界を取得（industries.csvから）
 */
export function getAllIndustries(): string[] {
  const industryMaster = loadIndustryMaster();
  return Array.from(industryMaster.values());
}

/**
 * 全福利厚生を取得（benefits.csvから）
 */
export function getAllBenefits(): string[] {
  const benefitMaster = loadBenefitMaster();
  return Array.from(benefitMaster.values());
}

/**
 * CSVの行をパースする（カンマ区切り、クォート対応）
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

// 後方互換性のため（既存コードが参照している場合）
export { getPostings as getCompanyDeadlines };
