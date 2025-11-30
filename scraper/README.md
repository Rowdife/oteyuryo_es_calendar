# 日経時価総額ランキング スクレイパー

日本経済新聞の時価総額ランキングから、上位200社の企業情報を取得し CSV 出力するスクレイピングツール。

## プロジェクト構成

```
ninki_es_calendar/
├── src/
│   ├── types.ts           # 型定義
│   ├── parser.ts          # HTML パーサー
│   ├── scraper.ts         # メインスクレイピングロジック
│   └── csvExporter.ts     # CSV 出力
├── tests/
│   ├── parser.test.ts     # パーサーのテスト
│   └── fixtures/          # テスト用サンプル HTML
├── output/
│   └── popular_companies.csv  # 出力結果
├── package.json
├── tsconfig.json
└── jest.config.js
```

## セットアップ

```bash
# 依存関係のインストール
npm install

# TypeScript のビルド（オプション）
npm run build
```

## 使い方

### スクレイピング実行

```bash
npm run scrape
```

このコマンドで：
1. 日経の時価総額ランキングページ（page=1〜7）から企業情報を取得
2. 200社分のデータを `output/popular_companies.csv` に出力

### テスト実行

```bash
# 全テスト実行
npm test

# ウォッチモード（ファイル変更時に自動実行）
npm run test:watch
```

## CSV 出力フォーマット

以下のヘッダーで CSV が出力されます：

| カラム名 | 説明 | 現在のステータス |
|---------|------|------------------|
| rank | ランキング順位 (1-200) | ✓ 取得済み |
| company_name | 企業名（日本語） | ✓ 取得済み |
| ticker | 証券コード | ✓ 取得済み |
| market_cap | 時価総額 | ✓ 取得済み |
| listing_market | 市場区分 (Prime/Standard/Growth) | △ 一部取得 |
| industry | 業種 | 今後実装予定 |
| foundation_year | 設立年 | 今後実装予定 |
| employees | 従業員数 | 今後実装予定 |
| is_newgrad_active | 新卒採用の有無 | 今後実装予定 |
| hq_location | 本社所在地 | 今後実装予定 |
| official_site_url | 公式サイト URL | 今後実装予定 |
| official_career_url | 採用サイト URL | 今後実装予定 |
| logo_image_url | ロゴ画像 URL | 今後実装予定 |
| revenue | 売上高 | 今後実装予定 |
| operating_income | 営業利益 | 今後実装予定 |
| notes | 備考 | 今後実装予定 |

## 技術スタック

- **言語**: TypeScript
- **HTTP クライアント**: axios
- **HTML パーサー**: cheerio
- **CSV 出力**: csv-writer
- **テストフレームワーク**: Jest

## 設定

スクレイピングの設定は `src/scraper.ts` の `DEFAULT_CONFIG` で変更可能：

```typescript
const DEFAULT_CONFIG: ScraperConfig = {
  baseUrl: 'https://www.nikkei.com/marketdata/ranking-jp/market-cap-high/',
  targetCompanyCount: 200,        // 取得する企業数
  companiesPerPage: 30,           // 1ページあたりの企業数
  requestDelayMs: 1000,           // リクエスト間隔（ミリ秒）
};
```

## エラー処理

- ページ取得に失敗した場合でも、次のページを試行します
- 目標企業数に達するまで続行します
- 詳細なログをコンソールに出力します

## 注意事項

### 法的配慮
- robots.txt を遵守してください
- 過度なリクエストでサーバーに負荷をかけないよう、1秒間隔でリクエストしています
- スクレイピング対象サイトの利用規約を確認してください

### データの精度
- `listing_market` が一部取得できない企業があります（元データに含まれていない場合）
- 時価総額は文字列形式で保存されています（カンマ区切り）
- データは取得時点のものであり、リアルタイムで更新されるわけではありません

## 今後の拡張予定

1. 各企業の詳細ページから追加情報を取得
2. 業種、従業員数、本社所在地などの情報を補完
3. 定期実行スケジューラの実装
4. データベースへの保存機能

## ライセンス

MIT
