import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostingById, getPostingsByCompany } from '@/lib/data';
import {
  getDaysUntilDeadline,
  getUrgencyLevel,
  formatDateLong,
  formatVerifiedAt,
} from '@/types/posting';
import DetailCTA from '@/components/DetailCTA';

interface PostingDetailPageProps {
  params: Promise<{
    postingId: string;
  }>;
}

export default async function PostingDetailPage({
  params,
}: PostingDetailPageProps) {
  const { postingId } = await params;
  const posting = getPostingById(postingId);

  if (!posting) {
    notFound();
  }

  const daysUntil = getDaysUntilDeadline(posting.deadline_date);
  const urgency = getUrgencyLevel(daysUntil);

  const urgencyText = {
    expired: '締切済',
    today: '本日締切',
    tomorrow: '明日締切',
    soon: `あと${daysUntil}日`,
    normal: `あと${daysUntil}日`,
  }[urgency];

  const sameCompanyPostings = getPostingsByCompany(
    posting.company_name,
    posting.id
  );

  return (
    <main id="main-content" className="container detail-page" role="main">
      <nav className="breadcrumb" aria-label="パンくずリスト">
        <Link href="/" className="breadcrumb-link">
          ← 一覧に戻る
        </Link>
      </nav>

      <article className="posting-detail" data-testid="posting-detail">
        {/* Header */}
        <header className="detail-header">
          <div className="detail-header-info">
            <h1 className="detail-company-name">{posting.company_name}</h1>
            <p className="detail-posting-title">{posting.posting_title}</p>
            <div className="detail-meta">
              <span className="detail-event-type">{posting.event_type}</span>
              {posting.target_year && (
                <span className="detail-target-year">{posting.target_year}</span>
              )}
            </div>
          </div>
        </header>

        {/* Deadline Section */}
        <section className="detail-deadline-section" aria-label="締切情報">
          <div className={`detail-deadline urgency-${urgency}`}>
            <time dateTime={posting.deadline_date} className="detail-deadline-date">
              {formatDateLong(posting.deadline_date)}
            </time>
            {posting.deadline_time && (
              <span className="detail-deadline-time">
                {posting.deadline_time}まで
              </span>
            )}
            <span className={`detail-urgency-badge urgency-${urgency}`}>
              {urgencyText}
            </span>
          </div>
        </section>

        {/* CTA Section */}
        <DetailCTA
          officialUrl={posting.official_url}
          companyName={posting.company_name}
          postingTitle={posting.posting_title}
          deadlineDate={posting.deadline_date}
          deadlineTime={posting.deadline_time}
        />

        {/* Tags */}
        {posting.tags.length > 0 && (
          <section className="detail-tags-section" aria-label="タグ">
            <h2 className="detail-section-title">タグ</h2>
            <ul className="detail-tags" aria-label="タグ一覧">
              {posting.tags.map((tag, idx) => (
                <li key={idx} className="detail-tag">
                  {tag}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Trust Block */}
        <section className="detail-trust-section" aria-label="情報の信頼性">
          <h2 className="detail-section-title">情報の信頼性</h2>
          <dl className="trust-info">
            <div className="trust-item">
              <dt>出典</dt>
              <dd>
                <a
                  href={posting.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="trust-link"
                >
                  {posting.official_url}
                </a>
              </dd>
            </div>
            <div className="trust-item">
              <dt>最終確認</dt>
              <dd>
                <VerifyIcon />
                {formatVerifiedAt(posting.last_verified_at)}
              </dd>
            </div>
          </dl>
        </section>

        {/* Same Company Postings */}
        {sameCompanyPostings.length > 0 && (
          <section className="detail-related-section" aria-label="同じ企業の他の募集">
            <h2 className="detail-section-title">
              {posting.company_name}の他の募集
            </h2>
            <ul className="related-postings">
              {sameCompanyPostings.map((related) => (
                <li key={related.id}>
                  <Link
                    href={`/p/${related.id}`}
                    className="related-posting-link"
                  >
                    <span className="related-posting-title">
                      {related.posting_title}
                    </span>
                    <span className="related-posting-deadline">
                      締切: {formatDateLong(related.deadline_date)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </main>
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
      className="verify-icon"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
