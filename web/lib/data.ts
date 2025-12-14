import fs from 'fs';
import path from 'path';
import { Posting } from '@/types/posting';

/**
 * CSVを読み込んでPosting一覧を返す
 */
export function getPostings(): Posting[] {
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
      tags: data.tags
        .split(',')
        .filter((tag) => tag.trim() !== ''),
      official_url: data.official_url,
      last_verified_at: data.last_verified_at || new Date().toISOString(),
      target_year: data.target_year || undefined,
    };
  });

  // 締切日でソート（昇順：早い日付から）
  return postings.sort((a, b) => {
    const dateA = a.deadline_date;
    const dateB = b.deadline_date;
    return dateA.localeCompare(dateB);
  });
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
 * 全タグを取得
 */
export function getAllTags(): string[] {
  const postings = getPostings();
  const tagSet = new Set<string>();
  postings.forEach((p) => {
    p.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
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
