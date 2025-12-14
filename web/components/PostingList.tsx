'use client';

import { useState } from 'react';
import { Posting, getDaysUntilDeadline, getUrgencyLevel } from '@/types/posting';
import PostingCard from './PostingCard';

interface PostingListProps {
  postings: Posting[];
  tags: string[];
  industries: string[];
}

// 給料範囲の定義
const SALARY_RANGES = [
  { key: 'under20', label: '20万未満', min: 0, max: 199999 },
  { key: '20-25', label: '20-25万', min: 200000, max: 249999 },
  { key: '25-30', label: '25-30万', min: 250000, max: 299999 },
  { key: 'over30', label: '30万以上', min: 300000, max: Infinity },
];

// 勤務地タイプの定義
const TRANSFER_TYPES = ['全国転勤', 'エリア限定', '勤務地固定'];

// イベント種別の定義
const EVENT_TYPES = ['インターン', '本選考ES'];

export default function PostingList({ postings, tags, industries }: PostingListProps) {
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedSalaryRange, setSelectedSalaryRange] = useState<string | null>(null);
  const [selectedTransferType, setSelectedTransferType] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showExpired, setShowExpired] = useState(false);

  const filteredPostings = postings.filter((p) => {
    // イベント種別フィルター
    if (selectedEventType && p.event_type !== selectedEventType) {
      return false;
    }

    // 業界フィルター
    if (selectedIndustry && p.industry !== selectedIndustry) {
      return false;
    }

    // 給料フィルター
    if (selectedSalaryRange) {
      const range = SALARY_RANGES.find((r) => r.key === selectedSalaryRange);
      if (range && (p.salary < range.min || p.salary > range.max)) {
        return false;
      }
    }

    // 勤務地フィルター
    if (selectedTransferType && p.transfer_type !== selectedTransferType) {
      return false;
    }

    // タグフィルター
    if (selectedTag && !p.tags.includes(selectedTag)) {
      return false;
    }

    // 締切済みフィルター
    if (!showExpired) {
      const daysUntil = getDaysUntilDeadline(p.deadline_date);
      const urgency = getUrgencyLevel(daysUntil);
      if (urgency === 'expired') {
        return false;
      }
    }

    return true;
  });

  const hasActiveFilter =
    selectedEventType ||
    selectedIndustry ||
    selectedSalaryRange ||
    selectedTransferType ||
    selectedTag;

  const clearAllFilters = () => {
    setSelectedEventType(null);
    setSelectedIndustry(null);
    setSelectedSalaryRange(null);
    setSelectedTransferType(null);
    setSelectedTag(null);
  };

  return (
    <>
      {/* Filter Bar */}
      <div className="filter-container" data-testid="filter-bar">
        {/* イベント種別フィルター */}
        <div className="filter-section">
          <span className="filter-section-label">種別:</span>
          <div className="filter-tags" role="group" aria-label="イベント種別フィルター">
            {EVENT_TYPES.map((eventType) => (
              <button
                key={eventType}
                className={`filter-tag ${selectedEventType === eventType ? 'active' : ''}`}
                onClick={() =>
                  setSelectedEventType(selectedEventType === eventType ? null : eventType)
                }
                aria-pressed={selectedEventType === eventType}
                data-testid="filter-event-type"
              >
                {eventType}
              </button>
            ))}
          </div>
        </div>

        {/* 業界フィルター */}
        <div className="filter-section">
          <span className="filter-section-label">業界:</span>
          <div className="filter-tags" role="group" aria-label="業界フィルター">
            {industries.map((industry) => (
              <button
                key={industry}
                className={`filter-tag ${selectedIndustry === industry ? 'active' : ''}`}
                onClick={() =>
                  setSelectedIndustry(selectedIndustry === industry ? null : industry)
                }
                aria-pressed={selectedIndustry === industry}
                data-testid="filter-industry"
              >
                {industry}
              </button>
            ))}
          </div>
        </div>

        {/* 給料フィルター */}
        <div className="filter-section">
          <span className="filter-section-label">初任給:</span>
          <div className="filter-tags" role="group" aria-label="給料フィルター">
            {SALARY_RANGES.map((range) => (
              <button
                key={range.key}
                className={`filter-tag ${selectedSalaryRange === range.key ? 'active' : ''}`}
                onClick={() =>
                  setSelectedSalaryRange(selectedSalaryRange === range.key ? null : range.key)
                }
                aria-pressed={selectedSalaryRange === range.key}
                data-testid="filter-salary"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* 勤務地フィルター */}
        <div className="filter-section">
          <span className="filter-section-label">勤務地:</span>
          <div className="filter-tags" role="group" aria-label="勤務地フィルター">
            {TRANSFER_TYPES.map((transferType) => (
              <button
                key={transferType}
                className={`filter-tag ${selectedTransferType === transferType ? 'active' : ''}`}
                onClick={() =>
                  setSelectedTransferType(
                    selectedTransferType === transferType ? null : transferType
                  )
                }
                aria-pressed={selectedTransferType === transferType}
                data-testid="filter-transfer"
              >
                {transferType}
              </button>
            ))}
          </div>
        </div>

        {/* タグフィルター */}
        <div className="filter-section">
          <span className="filter-section-label">タグ:</span>
          <div className="filter-tags" role="group" aria-label="タグフィルター">
            {tags.map((tag) => (
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
        </div>

        {/* コントロールボタン */}
        <div className="filter-controls">
          {hasActiveFilter && (
            <button
              className="clear-filter"
              onClick={clearAllFilters}
              aria-label="すべてのフィルターをクリア"
              data-testid="clear-filter"
            >
              フィルターをクリア
            </button>
          )}
          <button
            className={`expired-toggle ${showExpired ? 'active' : ''}`}
            onClick={() => setShowExpired(!showExpired)}
            aria-pressed={showExpired}
            data-testid="expired-toggle"
          >
            締切済みを表示
          </button>
        </div>
      </div>

      {/* Posting List */}
      <section
        className="posting-list"
        aria-label="ES締切一覧"
        aria-live="polite"
      >
        {filteredPostings.length === 0 ? (
          <div className="empty-state" role="status">
            <h2>該当する募集がありません</h2>
            <p>フィルター条件を変更してください</p>
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
