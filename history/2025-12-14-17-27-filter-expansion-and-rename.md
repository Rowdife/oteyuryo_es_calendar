# 2025-12-14 フィルタリング機能拡張 & サービス名変更

## Summary
フィルタリング機能を5カテゴリに拡張し、インターンシップダミーデータを追加。サービス名を「人気企業ESカレンダー」から「大手・優良企業ESカレンダー」に変更し、SEO最適化とドキュメント更新を実施。

## Changes

### フィルタリング機能拡張
- `web/components/PostingList.tsx`: 5つのフィルターカテゴリを実装
  - 種別（インターン/本選考ES）
  - 業界（メーカー、金融、商社、IT・通信、小売・サービス、コンサル、インフラ・公共）
  - 初任給（20万未満/20-25万/25-30万/30万以上）
  - 勤務地（全国転勤/エリア限定/勤務地固定）
  - タグ（グローバル企業、ベンチャー、福利厚生充実、高年収）
- `web/app/page.tsx`: industriesをPostingListに渡すよう変更
- `web/app/globals.css`: .filter-container, .filter-section, .filter-controls スタイル追加
- `web/data/es_deadlines.csv`: インターンシップダミーデータ3件追加（楽天、野村證券、デロイトトーマツ）

### サービス名変更
- ディレクトリ名: `ninki_es_calendar/` → `oteyuryo_es_calendar/`
- `web/package.json`: name変更 `ninki-es-calendar-web` → `oteyuryo-es-calendar-web`
- `package.json`: name変更 `ninki-es-calendar` → `oteyuryo-es-calendar`
- `web/app/page.tsx`: h1タイトル変更
- `web/components/DetailCTA.tsx`: ICSファイルのPRODID/UID変更
- GitHub remote URL更新

### SEO最適化
- `web/app/layout.tsx`: metadata大幅更新
  - title: 「大手・優良企業ESカレンダー | 26卒・27卒 ES締切一覧」
  - description, keywords, OGP, Twitter Card設定
- `web/app/robots.ts`: 新規作成（クロール許可設定）
- `web/app/sitemap.ts`: 新規作成（動的サイトマップ生成）
- `web/app/p/[postingId]/page.tsx`: generateMetadata関数追加（動的メタデータ）

### ドキュメント更新
- `docs/README.md`: タイトル変更
- `docs/product/01_problem_market.md`: 掲載基準の明確化、マネタイズ戦略更新
- `docs/architecture/01_architecture.md`: ディレクトリパス変更
- `scraper/README.md`: ディレクトリパス変更
- `task_history/*.md`: サービス名・パス変更

### その他修正
- `web/app/globals.css`: .industry-badge を inline-flex + align-items: center に修正（垂直揃え統一）
- `web/e2e/home.spec.ts`: タイトルテストを正規表現マッチに変更

## Decisions

| Decision | Reason |
|----------|--------|
| サービス名を「大手・優良企業ESカレンダー」に変更 | マネタイズ時に「人気企業」だと有名でない企業の広告掲載で信頼を損なうリスク。「大手」は客観的指標、「優良」は条件基準で柔軟に対応可能 |
| ディレクトリ名を `oteyuryo_es_calendar` に | 「大手・優良」をローマ字化 |
| フィルターを5カテゴリに分割 | ユーザーが多角的に企業を絞り込めるよう。将来のマネタイズ（業界別広告等）にも対応 |
| インターンシップダミーデータ追加 | イベント種別フィルターの動作確認用 |
| SEOでrobots.ts/sitemap.tsを追加 | 検索エンジンのクロール効率化、インデックス促進 |

## Issues & Solutions

- **Issue**: タイトルテストがSEO最適化後に失敗
  **Solution**: 完全一致から正規表現マッチ `/大手・優良企業ESカレンダー/` に変更

- **Issue**: .industry-badge と .salary-badge で縦揃えが異なる
  **Solution**: .industry-badge を `display: inline-flex; align-items: center;` に統一

## TODO

- [ ] 本番URL設定（`https://es-calendar.example.com` を実際のURLに変更）
- [ ] OGP画像作成（`/public/og-image.png` 1200x630px）
- [ ] Google Search Console認証コード設定
- [ ] 掲載基準の明文化ページ作成（ユーザー向け説明）

---
Recorded by Scribe agent
