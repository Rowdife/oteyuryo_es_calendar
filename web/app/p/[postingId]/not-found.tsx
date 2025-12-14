import Link from 'next/link';

export default function PostingNotFound() {
  return (
    <main className="container not-found-page" role="main">
      <h1>募集が見つかりません</h1>
      <p>お探しの募集情報は存在しないか、削除された可能性があります。</p>
      <Link href="/" className="not-found-link">
        ← 一覧に戻る
      </Link>
    </main>
  );
}
