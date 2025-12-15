import PostingList from "@/components/PostingList";
import { getPostings, getAllTags, getAllIndustries } from "@/lib/data";

export default function Home() {
  const postings = getPostings();
  const tags = getAllTags();
  const industries = getAllIndustries();

  return (
    <main id="main-content" className="container" role="main">
      <h1>大手企業・優良企業ESカレンダー</h1>
      <p className="page-description" role="doc-subtitle">
        大手企業・優良企業のES締切日を一覧で確認 | 26卒・27卒対応
      </p>
      <PostingList postings={postings} tags={tags} industries={industries} />
    </main>
  );
}
