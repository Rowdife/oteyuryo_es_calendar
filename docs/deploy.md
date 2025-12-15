# Deploy / Hosting（スマホ確認用）

目的：スマホからアクセスできるように、`web/`（Next.js）を公開する。

## 結論（最短）

Next.js をそのままホスティングするなら **Vercel が最も簡単**です（ビルド/SSR/ルーティングが自動）。

Firebase Hosting は「静的ホスティング」は簡単ですが、Next.js の SSR/動的ルート対応まで含めると構成が増えます（Cloud Functions / Cloud Run 等）。

---

## Option A: Vercel（推奨）

### 手順（GUI）

1. Vercel にログイン
2. New Project → Git から `oteyuryo_es_calendar` を選択
3. **Root Directory** を `web` に設定
4. Framework: Next.js（自動検出）
5. Deploy

### 確認ポイント

- `web/package.json` の `build` が `next build` になっていること
- `web/` 直下で `npm run build` が通ること

---

## Option B: Firebase（最小構成で使いたい場合）

### 使い分け

- **静的サイト（SSGのみ）**なら Firebase Hosting で簡単
- **SSR/動的ルートが必要**なら Firebase Hosting + Functions/Run が必要になり、Vercelより手数が増える

### Firebase Hosting（静的のみ）の前提

`next export` 相当の静的出力に寄せられる場合のみ推奨。

---

## 推奨運用（MVP）

- まずは Vercel で公開して、URL をスマホで確認できる状態にする
- データ更新がある場合も、Git push で自動デプロイされる形にする

