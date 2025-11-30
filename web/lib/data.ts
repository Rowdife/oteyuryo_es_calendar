import fs from 'fs';
import path from 'path';
import { CompanyDeadline } from '@/types/company';

/**
 * モックデータCSVを読み込んで企業締切情報を返す
 */
export function getCompanyDeadlines(): CompanyDeadline[] {
  const filePath = path.join(process.cwd(), 'data', 'es_deadlines.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const lines = fileContent.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const data: Record<string, string> = {};

    headers.forEach((header, index) => {
      data[header] = values[index] || '';
    });

    return {
      id: data.id,
      company_name: data.company_name,
      ticker: data.ticker,
      deadline_date: data.deadline_date,
      deadline_time: data.deadline_time,
      event_type: data.event_type,
      tags: data.tags.split(',').filter(tag => tag.trim() !== ''),
      official_url: data.official_url,
    };
  });
}

/**
 * CSVの行をパースする（カンマ区切り、ただしタグ内のカンマは考慮）
 * 簡易的な実装
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
