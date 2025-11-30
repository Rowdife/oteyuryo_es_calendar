interface FilterBarProps {
  allTags: string[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
  onClearFilter: () => void;
}

export default function FilterBar({
  allTags,
  selectedTags,
  onTagClick,
  onClearFilter,
}: FilterBarProps) {
  const isTagSelected = (tag: string) => selectedTags.includes(tag);

  return (
    <div data-testid="filter-bar" className="filter-bar">
      <div className="filter-label">絞り込み:</div>

      <div className="filter-tags">
        {allTags.map((tag) => (
          <button
            key={tag}
            data-testid="filter-tag"
            className={`filter-tag ${isTagSelected(tag) ? 'active' : ''}`}
            onClick={() => onTagClick(tag)}
          >
            #{tag}
          </button>
        ))}
      </div>

      {selectedTags.length > 0 && (
        <button
          data-testid="clear-filter"
          className="clear-filter"
          onClick={onClearFilter}
        >
          すべて表示
        </button>
      )}
    </div>
  );
}
