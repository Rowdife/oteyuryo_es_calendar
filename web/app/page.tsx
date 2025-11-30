import CompanyCalendar from '@/components/CompanyCalendar';
import { getCompanyDeadlines } from '@/lib/data';

export default function Home() {
  const companies = getCompanyDeadlines();

  return (
    <main className="container">
      <h1>人気企業ESカレンダー</h1>
      <CompanyCalendar companies={companies} />
    </main>
  );
}
