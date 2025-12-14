'use client';

interface DetailCTAProps {
  officialUrl: string;
  companyName: string;
  postingTitle: string;
  deadlineDate: string;
  deadlineTime?: string;
}

export default function DetailCTA({
  officialUrl,
  companyName,
  postingTitle,
  deadlineDate,
  deadlineTime,
}: DetailCTAProps) {
  const handleAddToCalendar = () => {
    // Generate Google Calendar URL
    const title = encodeURIComponent(`ES締切: ${companyName} - ${postingTitle}`);
    const deadline = deadlineTime
      ? `${deadlineDate.replace(/-/g, '')}T${deadlineTime.replace(':', '')}00`
      : `${deadlineDate.replace(/-/g, '')}`;

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${deadline}/${deadline}&details=${encodeURIComponent(
      `公式サイト: ${officialUrl}`
    )}`;

    window.open(calendarUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="detail-cta-section" aria-label="アクション">
      <a
        href={officialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="detail-cta-button primary"
      >
        <ExternalLinkIcon />
        公式サイトで詳細を見る
      </a>
      <button
        type="button"
        className="detail-cta-button secondary"
        onClick={handleAddToCalendar}
        aria-label="Googleカレンダーに追加"
      >
        <CalendarIcon />
        カレンダーに追加
      </button>
    </section>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="16"
      height="16"
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

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
