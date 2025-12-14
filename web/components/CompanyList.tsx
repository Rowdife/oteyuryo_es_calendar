import { CompanyDeadline } from '@/types/company';

interface CompanyListProps {
  companies: CompanyDeadline[];
}

/**
 * 日付を月/日形式にフォーマット
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
}

/**
 * ISO形式の日付文字列を返す（time要素のdatetime属性用）
 */
function getISODate(dateString: string, timeString?: string): string {
  const date = new Date(dateString);
  if (timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    date.setHours(hours || 0, minutes || 0);
  }
  return date.toISOString();
}

/**
 * 締切までの日数を計算
 */
function getDaysUntilDeadline(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(dateString);
  deadline.setHours(0, 0, 0, 0);
  const diffTime = deadline.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 緊急度クラスを取得
 */
function getUrgencyClass(daysUntil: number): string {
  if (daysUntil <= 0) return 'urgent-today';
  if (daysUntil === 1) return 'urgent-tomorrow';
  if (daysUntil <= 3) return 'urgent-soon';
  return '';
}

/**
 * 緊急度バッジのテキストを取得
 */
function getUrgencyBadge(daysUntil: number): { text: string; class: string } | null {
  if (daysUntil < 0) return { text: '締切済', class: 'today' };
  if (daysUntil === 0) return { text: '本日締切', class: 'today' };
  if (daysUntil === 1) return { text: '明日締切', class: 'tomorrow' };
  if (daysUntil <= 3) return { text: `あと${daysUntil}日`, class: 'soon' };
  return null;
}

export default function CompanyList({ companies }: CompanyListProps) {
  return (
    <section className="company-list" aria-label="企業ES締切リスト">
      {companies.map((company) => {
        const daysUntil = getDaysUntilDeadline(company.deadline_date);
        const urgencyClass = getUrgencyClass(daysUntil);
        const urgencyBadge = getUrgencyBadge(daysUntil);

        return (
          <article
            key={company.id}
            data-testid="company-item"
            className={`company-item ${urgencyClass}`.trim()}
            aria-label={`${company.company_name} - 締切: ${formatDate(company.deadline_date)}`}
          >
            {/* 左：締切日 */}
            <div className="deadline-section">
              <div className="deadline-wrapper">
                <time
                  data-testid="deadline"
                  className={`deadline ${urgencyClass}`.trim()}
                  dateTime={getISODate(company.deadline_date, company.deadline_time)}
                >
                  {formatDate(company.deadline_date)}
                </time>
                {urgencyBadge && (
                  <span
                    className={`urgency-badge ${urgencyBadge.class}`}
                    role="status"
                    aria-live="polite"
                  >
                    {urgencyBadge.text}
                  </span>
                )}
              </div>
              <div className="deadline-time" aria-label="締切時間">
                {company.deadline_time}
              </div>
            </div>

            {/* 中央：企業情報 */}
            <div className="company-content">
              <a
                href={company.official_url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="company-link"
                className="company-link"
                aria-label={`${company.company_name}の採用ページを開く（新しいタブ）`}
              >
                <h2>{company.company_name}</h2>
              </a>

              <div className="company-info">
                <span className="event-type" aria-label="イベント種別">
                  {company.event_type}
                </span>
              </div>
            </div>

            {/* 右：タグ */}
            <ul className="tags" aria-label="タグ">
              {company.tags.map((tag, index) => (
                <li key={index} data-testid="tag" className="tag">
                  #{tag}
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </section>
  );
}
