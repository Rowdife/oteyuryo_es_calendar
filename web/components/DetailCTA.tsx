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
  const eventTitle = `ES締切: ${companyName} - ${postingTitle}`;

  const handleAddToGoogleCalendar = () => {
    const title = encodeURIComponent(eventTitle);
    const deadline = deadlineTime
      ? `${deadlineDate.replace(/-/g, '')}T${deadlineTime.replace(':', '')}00`
      : `${deadlineDate.replace(/-/g, '')}`;

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${deadline}/${deadline}&details=${encodeURIComponent(
      `公式サイト: ${officialUrl}`
    )}`;

    window.open(calendarUrl, '_blank', 'noopener,noreferrer');
  };

  const handleAddToAppleCalendar = () => {
    // Generate ICS file content
    const formatDate = (date: string, time?: string) => {
      if (time) {
        return `${date.replace(/-/g, '')}T${time.replace(':', '')}00`;
      }
      return `${date.replace(/-/g, '')}`;
    };

    const deadline = formatDate(deadlineDate, deadlineTime);
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Oteyuryo ES Calendar//JP',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART:${deadline}`,
      `DTEND:${deadline}`,
      `DTSTAMP:${now}`,
      `UID:${Date.now()}@oteyuryo-es-calendar`,
      `SUMMARY:${eventTitle}`,
      `DESCRIPTION:公式サイト: ${officialUrl}`,
      `URL:${officialUrl}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    // Download ICS file
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${companyName}_ES締切.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
      <div className="calendar-buttons">
        <button
          type="button"
          className="detail-cta-button secondary"
          onClick={handleAddToGoogleCalendar}
          aria-label="Googleカレンダーに追加"
        >
          <GoogleCalendarIcon />
          カレンダーに追加(Google)
        </button>
        <button
          type="button"
          className="detail-cta-button secondary"
          onClick={handleAddToAppleCalendar}
          aria-label="Appleカレンダーに追加"
        >
          <AppleIcon />
          カレンダーに追加(Apple)
        </button>
      </div>
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

function GoogleCalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="#4285F4" />
      <rect x="5" y="10" width="14" height="10" fill="#fff" />
      <line x1="16" y1="2" x2="16" y2="6" stroke="#4285F4" strokeWidth="2" />
      <line x1="8" y1="2" x2="8" y2="6" stroke="#4285F4" strokeWidth="2" />
      <rect x="7" y="12" width="3" height="3" fill="#EA4335" />
      <rect x="11" y="12" width="3" height="3" fill="#FBBC05" />
      <rect x="15" y="12" width="2" height="3" fill="#34A853" />
      <rect x="7" y="16" width="3" height="2" fill="#4285F4" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}
