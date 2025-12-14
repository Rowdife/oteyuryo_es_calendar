/**
 * 募集要項（Posting）
 * ES締切情報を「募集要項」単位で管理する
 */
export interface Posting {
  id: string;
  company_name: string;
  ticker: string;
  /** 募集タイトル（職種／コース名） */
  posting_title: string;
  /** ES締切日 YYYY-MM-DD */
  deadline_date: string;
  /** ES締切時刻 HH:MM（時刻未確認の場合は空文字） */
  deadline_time: string;
  /** イベント種別: 本選考ES / インターン */
  event_type: string;
  /** タグ（業界、職種カテゴリなど） */
  tags: string[];
  /** 公式サイトURL（出典） */
  official_url: string;
  /** 最終確認日時 ISO8601 */
  last_verified_at: string;
  /** 対象卒年（例: 26卒） */
  target_year?: string;
}

/**
 * 一覧表示用のPosting（軽量版）
 */
export type PostingListItem = Pick<
  Posting,
  | 'id'
  | 'company_name'
  | 'posting_title'
  | 'deadline_date'
  | 'deadline_time'
  | 'event_type'
  | 'tags'
  | 'official_url'
  | 'last_verified_at'
>;

/**
 * 締切までの日数を計算
 */
export function getDaysUntilDeadline(deadlineDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(deadlineDate);
  deadline.setHours(0, 0, 0, 0);
  const diffTime = deadline.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 緊急度レベルを取得
 */
export function getUrgencyLevel(
  daysUntil: number
): 'expired' | 'today' | 'tomorrow' | 'soon' | 'normal' {
  if (daysUntil < 0) return 'expired';
  if (daysUntil === 0) return 'today';
  if (daysUntil === 1) return 'tomorrow';
  if (daysUntil <= 3) return 'soon';
  return 'normal';
}

/**
 * 日付を MM/DD 形式にフォーマット
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
}

/**
 * 日付を YYYY年M月D日 形式にフォーマット
 */
export function formatDateLong(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * 最終確認日時を相対的な表現にフォーマット
 */
export function formatVerifiedAt(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return '1時間以内に確認';
  if (diffHours < 24) return `${diffHours}時間前に確認`;
  if (diffDays < 7) return `${diffDays}日前に確認`;
  return `${date.getMonth() + 1}/${date.getDate()}に確認`;
}
