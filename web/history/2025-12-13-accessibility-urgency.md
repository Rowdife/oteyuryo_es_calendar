# 2025-12-13 Accessibility & Urgency Indicators

## Summary
Implemented HIGH priority accessibility fixes and urgency indicators for deadline visualization.

## Changes

### `app/globals.css`
- Added CSS variables for urgency colors (`--urgent-red`, `--urgent-orange`, `--urgent-yellow`)
- Added `--focus-ring` variable for consistent focus styling
- Improved color contrast: `--text-secondary` (#cbd5e1 → #e2e8f0), `--text-muted` (#94a3b8 → #a8b5c4)
- Added `:focus-visible` styles for all interactive elements
- Added `.skip-link` styles for keyboard navigation
- Added urgency badge styles (`.urgency-badge.today`, `.tomorrow`, `.soon`)
- Added urgency item styles (`.company-item.urgent-today`, etc.)
- Added pulse animation for "today" deadline badge
- Added `.page-description` style
- Fixed `.tags` to work as `<ul>` (removed list-style)

### `app/layout.tsx`
- Added skip-to-content link for keyboard users

### `app/page.tsx`
- Added `id="main-content"` and `role="main"` to `<main>`
- Added page description subtitle

### `components/CompanyList.tsx`
- Changed outer `<div>` to `<section>` with `aria-label`
- Changed company items from `<div>` to `<article>` with `aria-label`
- Added `<time>` element with `dateTime` attribute for deadline dates
- Added urgency calculation functions (`getDaysUntilDeadline`, `getUrgencyClass`, `getUrgencyBadge`)
- Added urgency badges showing "本日締切", "明日締切", "あと N日"
- Changed tags container from `<div>` to `<ul>` with `<li>` children
- Added `aria-label` to links, event type, and tags

## Decisions

| Decision | Reason |
|----------|--------|
| Use `:focus-visible` instead of `:focus` | Prevents focus ring on mouse click, shows only for keyboard |
| Urgency threshold: 3 days | Balance between urgency awareness and visual noise |
| Pulse animation for today | Draw attention to immediate deadlines |
| Skip link hidden until focused | Clean UI while maintaining keyboard accessibility |

## Accessibility Improvements

- WCAG 2.1 AA color contrast compliance
- Keyboard navigation support (Tab key focus visible)
- Screen reader support (ARIA labels, semantic HTML)
- Skip-to-content link for keyboard users

## TODO

- [ ] Add empty state UI when filter returns no results
- [ ] Add loading skeleton UI
- [ ] Implement mobile-friendly tag display
- [ ] Optimize font loading with next/font

---
Recorded by Scribe agent
