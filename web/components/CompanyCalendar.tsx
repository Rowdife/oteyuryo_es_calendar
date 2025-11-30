'use client';

import { useState, useMemo } from 'react';
import CompanyList from '@/components/CompanyList';
import FilterBar from '@/components/FilterBar';
import { CompanyDeadline } from '@/types/company';

interface CompanyCalendarProps {
  companies: CompanyDeadline[];
}

export default function CompanyCalendar({ companies }: CompanyCalendarProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 全タグのユニークなリストを取得
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    companies.forEach((company) => {
      company.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [companies]);

  // タグクリック時のハンドラ
  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag) // 選択解除
        : [...prev, tag] // 選択追加
    );
  };

  // フィルタクリア
  const handleClearFilter = () => {
    setSelectedTags([]);
  };

  // フィルタリングされた企業リスト
  const filteredCompanies = useMemo(() => {
    if (selectedTags.length === 0) {
      return companies;
    }

    // OR条件：選択されたタグのいずれかを持つ企業を表示
    return companies.filter((company) =>
      company.tags.some((tag) => selectedTags.includes(tag))
    );
  }, [companies, selectedTags]);

  return (
    <>
      <FilterBar
        allTags={allTags}
        selectedTags={selectedTags}
        onTagClick={handleTagClick}
        onClearFilter={handleClearFilter}
      />

      <CompanyList companies={filteredCompanies} />
    </>
  );
}
