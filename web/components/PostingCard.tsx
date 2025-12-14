'use client';

import Link from 'next/link';
import {
  Posting,
  getDaysUntilDeadline,
  getUrgencyLevel,
  formatDateShort,
  formatVerifiedAt,
} from '@/types/posting';

interface PostingCardProps {
  posting: Posting;
}

export default function PostingCard({ posting }: PostingCardProps) {
  const daysUntil = getDaysUntilDeadline(posting.deadline_date);
  const urgency = getUrgencyLevel(daysUntil);

  const urgencyText = {
    expired: '締切済',
    today: '本日締切',
    tomorrow: '明日締切',
    soon: `あと${daysUntil}日`,
    normal: `あと${daysUntil}日`,
  }[urgency];

  const urgencyClass = {
    expired: 'urgency-expired',
    today: 'urgency-today',
    tomorrow: 'urgency-tomorrow',
    soon: 'urgency-soon',
    normal: '',
  }[urgency];

  return (
    <article
      className={`posting-card ${urgencyClass}`.trim()}
      data-testid="posting-card"
    >
      <Link
        href={`/p/${posting.id}`}
        className="posting-card-link"
        data-testid="posting-link"
      >
        {/* 左: 締切日 */}
        <div className="posting-deadline">
          <time
            dateTime={posting.deadline_date}
            className={`deadline-date ${urgencyClass}`.trim()}
            data-testid="deadline"
          >
            {formatDateShort(posting.deadline_date)}
          </time>
          {posting.deadline_time && (
            <span className="deadline-time">{posting.deadline_time}</span>
          )}
          {urgency !== 'normal' && (
            <span className={`urgency-badge ${urgencyClass}`}>
              {urgencyText}
            </span>
          )}
        </div>

        {/* 中央: 企業情報 */}
        <div className="posting-info">
          <h2 className="company-name" data-testid="company-name">
            {posting.company_name}
          </h2>
          <p className="posting-title" data-testid="posting-title">
            {posting.posting_title}
          </p>
          <div className="posting-meta">
            <span className="event-type">{posting.event_type}</span>
            {posting.target_year && (
              <span className="target-year">{posting.target_year}</span>
            )}
          </div>
        </div>

        {/* 右: 信頼情報 + タグ */}
        <div className="posting-trust">
          <div className="verified-at" title={posting.last_verified_at}>
            <VerifyIcon />
            <span>{formatVerifiedAt(posting.last_verified_at)}</span>
          </div>
          <ul className="tags" aria-label="タグ">
            {posting.tags.slice(0, 3).map((tag, idx) => (
              <li key={idx} className="tag" data-testid="tag">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </Link>

      {/* 公式リンク（カード外クリック用） */}
      <a
        href={posting.official_url}
        target="_blank"
        rel="noopener noreferrer"
        className="official-link"
        aria-label={`${posting.company_name}の公式サイトを開く`}
        onClick={(e) => e.stopPropagation()}
        data-testid="official-link"
      >
        <ExternalLinkIcon />
        公式
      </a>
    </article>
  );
}

function VerifyIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
