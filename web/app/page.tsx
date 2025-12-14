import PostingList from '@/components/PostingList';
import { getPostings, getAllTags } from '@/lib/data';

export default function Home() {
  const postings = getPostings();
  const tags = getAllTags();

  return (
    <main id="main-content" className="container" role="main">
      <h1>人気企業ESカレンダー</h1>
      <p className="page-description" role="doc-subtitle">
        時価総額上位200社のES締切情報
      </p>
      <PostingList postings={postings} tags={tags} />
    </main>
  );
}
