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

export default function CompanyList({ companies }: CompanyListProps) {
  return (
    <div className="company-list">
      {companies.map((company) => (
        <div key={company.id} data-testid="company-item" className="company-item">
          {/* 左：締切日 */}
          <div className="deadline-section">
            <div data-testid="deadline" className="deadline">
              {formatDate(company.deadline_date)}
            </div>
            <div className="deadline-time">{company.deadline_time}</div>
          </div>

          {/* 中央：企業情報 */}
          <div className="company-content">
            <a
              href={company.official_url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="company-link"
              className="company-link"
            >
              <h2>{company.company_name}</h2>
            </a>

            <div className="company-info">
              <div className="event-type">{company.event_type}</div>
            </div>
          </div>

          {/* 右：タグ */}
          <div className="tags">
            {company.tags.map((tag, index) => (
              <span key={index} data-testid="tag" className="tag">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
