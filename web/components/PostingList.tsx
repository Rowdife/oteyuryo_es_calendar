'use client';

import { useState } from 'react';
import { Posting } from '@/types/posting';
import PostingCard from './PostingCard';

interface PostingListProps {
  postings: Posting[];
  tags: string[];
}

export default function PostingList({ postings, tags }: PostingListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPostings = selectedTag
    ? postings.filter((p) => p.tags.includes(selectedTag))
    : postings;

  return (
    <>
      {/* Filter Bar */}
      <nav className="filter-bar" aria-label="タグフィルター" data-testid="filter-bar">
        <span className="filter-label" id="filter-label">
          絞り込み:
        </span>
        <div
          className="filter-tags"
          role="group"
          aria-labelledby="filter-label"
        >
          {tags.slice(0, 8).map((tag) => (
            <button
              key={tag}
              className={`filter-tag ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              aria-pressed={selectedTag === tag}
              data-testid="filter-tag"
            >
              {tag}
            </button>
          ))}
        </div>
        {selectedTag && (
          <button
            className="clear-filter"
            onClick={() => setSelectedTag(null)}
            aria-label="フィルターをクリア"
            data-testid="clear-filter"
          >
            クリア
          </button>
        )}
      </nav>

      {/* Posting List */}
      <section
        className="posting-list"
        aria-label="ES締切一覧"
        aria-live="polite"
      >
        {filteredPostings.length === 0 ? (
          <div className="empty-state" role="status">
            <h2>該当する募集がありません</h2>
            <p>別のタグを選択してください</p>
          </div>
        ) : (
          filteredPostings.map((posting) => (
            <PostingCard key={posting.id} posting={posting} />
          ))
        )}
      </section>
    </>
  );
}
