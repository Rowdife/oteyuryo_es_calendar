import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPostingById, getPostingsByCompany } from "@/lib/data";
import {
  getDaysUntilDeadline,
  getUrgencyLevel,
  getUrgencyText,
  getUrgencyClass,
  formatDateLong,
  formatVerifiedAt,
} from "@/types/posting";
import DetailCTA from "@/components/DetailCTA";

interface PostingDetailPageProps {
  params: Promise<{
    postingId: string;
  }>;
}

const siteName = "大手・優良企業ESカレンダー";
const siteUrl = "https://es-calendar.example.com"; // TODO: 本番URLに変更

export async function generateMetadata({
  params,
}: PostingDetailPageProps): Promise<Metadata> {
  const { postingId } = await params;
  const posting = getPostingById(postingId);

  if (!posting) {
    return {
      title: "募集が見つかりません",
    };
  }

  const title = `${posting.company_name} ${posting.posting_title} ES締切【${formatDateLong(posting.deadline_date)}】`;
  const description = `${posting.company_name}の${posting.posting_title}のES締切日は${formatDateLong(posting.deadline_date)}${posting.deadline_time ? ` ${posting.deadline_time}` : ""}です。${posting.industry ? `業界: ${posting.industry}。` : ""}${posting.target_year ? `${posting.target_year}対象。` : ""}大手・優良企業のES締切を見逃さずに管理しよう。`;

  return {
    title,
    description,
    keywords: [
      `${posting.company_name} ES 締切`,
      `${posting.company_name} エントリーシート`,
      posting.industry ? `${posting.industry} ES 締切` : "",
      posting.target_year || "",
      "大手企業 ES",
      "優良企業 ES",
    ].filter(Boolean),
    openGraph: {
      type: "article",
      locale: "ja_JP",
      url: `${siteUrl}/p/${postingId}`,
      siteName: siteName,
      title,
      description,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${posting.company_name} ES締切情報`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `/p/${postingId}`,
    },
  };
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
  const urgencyText = getUrgencyText(urgency, daysUntil);
  const urgencyClassName = getUrgencyClass(urgency);

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
                <span className="detail-target-year">
                  {posting.target_year}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Deadline Section */}
        <section className="detail-deadline-section" aria-label="締切情報">
          <div className={`detail-deadline ${urgencyClassName}`}>
            <time
              dateTime={posting.deadline_date}
              className="detail-deadline-date"
            >
              {formatDateLong(posting.deadline_date)}
            </time>
            {posting.deadline_time && (
              <span className="detail-deadline-time">
                {posting.deadline_time}まで
              </span>
            )}
            <span className={`detail-urgency-badge ${urgencyClassName}`}>
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

        {/* 募集概要セクション */}
        <section className="detail-overview-section" aria-label="募集概要">
          <h2 className="detail-section-title">募集概要</h2>
          <dl className="detail-dl">
            {posting.industry && (
              <div className="detail-dl-item">
                <dt>業界</dt>
                <dd>
                  <span className="industry-badge-detail">
                    {posting.industry}
                  </span>
                </dd>
              </div>
            )}
            {posting.job_type && (
              <div className="detail-dl-item">
                <dt>職種</dt>
                <dd>{posting.job_type}</dd>
              </div>
            )}
          </dl>
        </section>

        {/* 待遇セクション */}
        <section className="detail-compensation-section" aria-label="待遇">
          <h2 className="detail-section-title">待遇</h2>
          <dl className="detail-dl">
            <div className="detail-dl-item">
              <dt>初任給</dt>
              <dd>
                {posting.salary > 0
                  ? `${posting.salary.toLocaleString()}円/月`
                  : "要確認"}
              </dd>
            </div>
            <div className="detail-dl-item">
              <dt>賞与</dt>
              <dd>{posting.has_bonus ? "あり" : "要確認"}</dd>
            </div>
            {posting.salary_notes && (
              <div className="detail-dl-item detail-dl-item-wide">
                <dt>備考</dt>
                <dd className="salary-notes">{posting.salary_notes}</dd>
              </div>
            )}
          </dl>
        </section>

        {/* 働き方セクション */}
        <section className="detail-workstyle-section" aria-label="働き方">
          <h2 className="detail-section-title">働き方</h2>
          <dl className="detail-dl">
            <div className="detail-dl-item">
              <dt>転勤</dt>
              <dd>
                <span
                  className={`transfer-badge transfer-${posting.transfer_type}`}
                >
                  {posting.transfer_type}
                </span>
              </dd>
            </div>
            <div className="detail-dl-item">
              <dt>年間有給</dt>
              <dd>{posting.annual_paid_leave_days}日</dd>
            </div>
            {posting.benefits.length > 0 && (
              <div className="detail-dl-item detail-dl-item-wide">
                <dt>福利厚生</dt>
                <dd>
                  <ul className="benefits-list">
                    {posting.benefits.map((benefit) => (
                      <li key={benefit} className="benefit-chip">
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        </section>

        {/* Tags */}
        {posting.tags.length > 0 && (
          <section className="detail-tags-section" aria-label="タグ">
            <h2 className="detail-section-title">タグ</h2>
            <ul className="detail-tags" aria-label="タグ一覧">
              {posting.tags.map((tag) => (
                <li key={tag} className="detail-tag">
                  {tag}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Trust Block */}
        <section className="detail-trust-section" aria-label="情報の出所">
          <h2 className="detail-section-title">情報の出所</h2>
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
          <section
            className="detail-related-section"
            aria-label="同じ企業の他の募集"
          >
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
