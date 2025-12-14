'use client';

import Link from 'next/link';
import {
  Posting,
  getDaysUntilDeadline,
  getUrgencyLevel,
  getUrgencyText,
  getUrgencyClass,
  formatDateShort,
} from '@/types/posting';

interface PostingCardProps {
  posting: Posting;
}

export default function PostingCard({ posting }: PostingCardProps) {
  const daysUntil = getDaysUntilDeadline(posting.deadline_date);
  const urgency = getUrgencyLevel(daysUntil);
  const urgencyText = getUrgencyText(urgency, daysUntil);
  const urgencyClassName = getUrgencyClass(urgency);

  return (
    <article
      className={`posting-card ${urgencyClassName}`.trim()}
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
            className={`deadline-date ${urgencyClassName}`.trim()}
            data-testid="deadline"
          >
            {formatDateShort(posting.deadline_date)}
          </time>
          {posting.deadline_time && (
            <span className="deadline-time" aria-label="締切時刻">
              {posting.deadline_time}
            </span>
          )}
          {urgency !== 'normal' && (
            <span className={`urgency-badge ${urgencyClassName}`}>
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
          {/* 業界・給与情報 */}
          <div className="posting-quick-info">
            {posting.industry && (
              <span className="industry-badge">{posting.industry}</span>
            )}
            {posting.salary > 0 && (
              <span className="salary-badge">
                月{Math.floor(posting.salary / 10000)}万円
                {posting.has_bonus && <span className="bonus-indicator">+賞与</span>}
              </span>
            )}
            <span className={`transfer-badge transfer-${posting.transfer_type}`}>
              {posting.transfer_type}
            </span>
          </div>
        </div>

        {/* 右: タグ + CTA */}
        <div className="posting-trust">
          <ul className="tags" aria-label="タグ">
            {posting.tags.slice(0, 3).map((tag) => (
              <li key={tag} className="tag" data-testid="tag">
                {tag}
              </li>
            ))}
          </ul>
          <a
            href={posting.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="submit-cta submit-cta-inline"
            aria-label={`${posting.company_name}にESを提出しに行く`}
            onClick={(e) => e.stopPropagation()}
            data-testid="submit-cta"
          >
            ESを提出
            <ExternalLinkIcon />
          </a>
        </div>
      </Link>

      {/* モバイル用CTA (768px以下で表示) */}
      <div className="posting-card-cta-mobile">
        <a
          href={posting.official_url}
          target="_blank"
          rel="noopener noreferrer"
          className="submit-cta"
          aria-label={`${posting.company_name}にESを提出しに行く`}
          onClick={(e) => e.stopPropagation()}
          data-testid="submit-cta-mobile"
        >
          ESを提出しに行く
          <ExternalLinkIcon />
        </a>
      </div>
    </article>
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
