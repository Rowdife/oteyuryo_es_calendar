# タグフィルタリング機能実装

**日付**: 2025-11-30
**担当**: Parker + Claude Code
**ステータス**: ✅ 完了

---

## 📌 タスクの概要

### 目的
人気企業ESカレンダーにタグによる絞り込み機能を追加し、ユーザーが業界や条件で企業を素早くフィルタリングできるようにする。

### 背景
- 企業リストが増えると、目的の企業を探すのが困難になる
- 業界別（金融、商社、メーカーなど）や条件別（まだ間に合う、転勤あり）で絞り込みたいニーズ
- TDD アプローチで品質を担保しながら開発

### スコープ
- **機能**: タグによるフィルタリング（OR条件）
- **UI**: FilterBar コンポーネント（選択可能なタグボタン群）
- **インタラクション**:
  - タグクリックで選択/選択解除
  - 複数タグ選択時は OR 条件
  - 「すべて表示」ボタンでフィルタクリア
- **実装範囲**: E2E テスト → コンポーネント実装 → CSS スタイリング

---

## 🛠️ 技術的決定事項

### アーキテクチャの選択

| 決定事項 | 内容 | 理由 |
|---------|------|------|
| **Server/Client Component 分離** | page.tsx (Server) + CompanyCalendar (Client) | Server Component で fs モジュールを使用し、Client Component で状態管理 |
| **OR条件フィルタリング** | 複数タグ選択時は「いずれか」で絞り込み | ユーザーは幅広い選択肢を見たいニーズが高い |
| **状態管理** | React useState + useMemo | 小規模なフィルタリングには十分でシンプル |
| **CSS 実装** | globals.css に追加 | CSS Modules や styled-components は過剰。グローバルCSSで一元管理 |

### 設計方針

1. **TDD（テスト駆動開発）**
   - E2E テストを先に書き、実装後に動作確認
   - 6つのテストケースで全ての振る舞いをカバー

2. **コンポーネント責務の分離**
   ```
   page.tsx (Server)
   ↓ データ取得 (fs読み込み)
   CompanyCalendar (Client)
   ↓ フィルタリングロジック
   ├─ FilterBar (UIのみ)
   └─ CompanyList (表示のみ)
   ```

3. **パフォーマンス最適化**
   - `useMemo` でタグリストとフィルタ結果をメモ化
   - 不要な再計算を防ぐ

### 重要なデータフロー

```typescript
// page.tsx (Server Component)
const companies = getCompanyDeadlines(); // fs で CSV 読み込み

// CompanyCalendar (Client Component)
const [selectedTags, setSelectedTags] = useState<string[]>([]);

// 全タグを抽出
const allTags = useMemo(() => {
  const tags = new Set<string>();
  companies.forEach((company) => {
    company.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}, [companies]);

// OR条件でフィルタリング
const filteredCompanies = useMemo(() => {
  if (selectedTags.length === 0) return companies;
  return companies.filter((company) =>
    company.tags.some((tag) => selectedTags.includes(tag))
  );
}, [companies, selectedTags]);
```

---

## 🐛 遭遇した問題と解決策

### 問題 1: Client Component で fs モジュールが使えない

**発覚時点**: E2E テスト実行時にビルドエラー

**症状**:
```
Module not found: Can't resolve 'fs'
Import trace for requested module:
./app/page.tsx
```

**原因**:
- page.tsx に `'use client'` ディレクティブを追加してフィルタリング状態管理を実装
- Client Component では Node.js の `fs` モジュールが使用不可
- `getCompanyDeadlines()` 関数が内部で `fs.readFileSync` を使用していた

**解決策**:
1. **CompanyCalendar.tsx を新規作成** (Client Component)
   - フィルタリングロジックと状態管理を担当
   - `companies` を props で受け取る

2. **page.tsx を Server Component に戻す**
   - `'use client'` ディレクティブを削除
   - データ取得のみを担当し、CompanyCalendar に渡す

3. **責務の明確化**
   ```
   Server Component (page.tsx)
   - fs でデータ読み込み
   - 静的なコンテンツのレンダリング

   Client Component (CompanyCalendar)
   - useState, useMemo による状態管理
   - インタラクティブなフィルタリング
   ```

**修正後のコード**:
```typescript
// page.tsx (Server Component)
import CompanyCalendar from '@/components/CompanyCalendar';
import { getCompanyDeadlines } from '@/lib/data';

export default function Home() {
  const companies = getCompanyDeadlines(); // Server-side で実行

  return (
    <main className="container">
      <h1>人気企業ESカレンダー</h1>
      <CompanyCalendar companies={companies} />
    </main>
  );
}
```

**学び**:
- Next.js 15 の Server Component / Client Component の境界を理解することが重要
- "use client" は必要最小限のコンポーネントにのみ適用すべき
- データ取得とインタラクティブな処理は責務を分離するのがベストプラクティス

---

## ✅ 実装の概要

### 主要な機能

1. **FilterBar コンポーネント**
   - 全タグを横並びで表示
   - クリックで選択/選択解除
   - 選択中のタグは青色でハイライト
   - フィルタ選択時に「すべて表示」ボタンを表示

2. **OR 条件フィルタリング**
   - 複数タグを選択可能
   - 選択されたタグの **いずれか** を持つ企業を表示
   - 例: 金融 + 商社 → 金融タグまたは商社タグを持つ企業

3. **リアルタイムフィルタリング**
   - タグクリック時に即座に企業リストが更新
   - useMemo によるパフォーマンス最適化

### ファイル構成

```
ninki_es_calendar/web/
├── app/
│   ├── page.tsx                      # Server Component（データ取得）
│   └── globals.css                   # FilterBar の CSS 追加
├── components/
│   ├── CompanyCalendar.tsx          # 新規: Client Component（フィルタリングロジック）
│   ├── FilterBar.tsx                # 新規: フィルタ UI
│   └── CompanyList.tsx              # 企業リスト表示
├── e2e/
│   ├── home.spec.ts                 # 既存: 5テスト
│   └── filtering.spec.ts            # 新規: 6テスト
└── data/
    └── es_deadlines.csv             # モックデータ（10社）
```

### テスト

**E2E テスト (filtering.spec.ts)**:
1. ✅ タグフィルタが表示されている
2. ✅ タグをクリックするとフィルタリングされる（金融 → 2社）
3. ✅ 複数タグを選択すると OR 条件でフィルタリングされる（金融 + 商社 → 4社）
4. ✅ 選択中のタグが視覚的に分かる（active クラス）
5. ✅ 選択中のタグを再クリックするとフィルタ解除される
6. ✅ 「すべて表示」ボタンでフィルタがクリアされる

**テスト結果**:
```bash
Running 11 tests using 5 workers
  11 passed (6.6s)
```
- 既存テスト 5 + 新規テスト 6 = **全11テストパス** ✅

### CSS スタイリング

**追加した CSS クラス** (globals.css:52-122):

| クラス | 役割 | 主なスタイル |
|--------|------|-------------|
| `.filter-bar` | フィルタバー全体 | glassmorphism、横並び配置 |
| `.filter-label` | "絞り込み:" ラベル | グレーのテキスト |
| `.filter-tags` | タグボタンのコンテナ | flex-wrap で折り返し |
| `.filter-tag` | 各タグボタン | 半透明の青背景、ホバーエフェクト |
| `.filter-tag.active` | 選択中のタグ | 濃い青背景、白文字、太字 |
| `.clear-filter` | すべて表示ボタン | グレー背景、ホバーで明るく |

**デザインの特徴**:
- Navy 基調のダークモード
- Glassmorphism (backdrop-filter: blur)
- ホバー時の微妙なアニメーション (translateY)
- アクティブタグは明確に区別できる配色

---

## 📊 動作確認

### フィルタリングの動作例

**初期状態 (タグ未選択)**:
- 表示企業数: 10社
- FilterBar: 全タグがグレー表示

**「金融」タグをクリック**:
- 表示企業数: 2社（三菱UFJ、三井住友FG）
- 「金融」タグが青色に変化
- 「すべて表示」ボタンが出現

**「商社」タグを追加クリック**:
- 表示企業数: 4社（金融2社 + 商社2社）
- 「金融」「商社」の両方が青色
- OR 条件で動作していることを確認

**「金融」タグを再クリック（解除）**:
- 表示企業数: 2社（商社2社のみ）
- 「金融」タグがグレーに戻る

**「すべて表示」をクリック**:
- 表示企業数: 10社（全企業）
- 全タグがグレーに戻る
- 「すべて表示」ボタンが消える

### パフォーマンス

- **初回レンダリング**: 即座に表示
- **フィルタリング**: クリック時にリアルタイムで更新
- **useMemo**: タグリスト、フィルタ結果ともにメモ化済み
- **将来的な拡張**: 200社のデータでも問題なく動作する設計

---

## 🔜 次回への引き継ぎ事項

### 完了したタスク
- ✅ タグフィルタリング機能のE2Eテスト作成
- ✅ 全タグのリストを表示するFilterBar作成
- ✅ フィルタリングロジックの実装
- ✅ 選択中タグのUI表示
- ✅ テスト実行と動作確認

### 未完了のタスク（ユーザーが明示）
1. **締切までの残り日数表示**
   - "あと3日" などの表示
   - 締切日と現在日時の差分計算

2. **締切日でのソート機能**
   - 昇順/降順の切り替え
   - デフォルトは締切が近い順

3. **200社のデータ収集**
   - ユーザーが手動で行う予定
   - CSV フォーマットは既に確定

### 今後の拡張案
1. **タグの階層化**
   - 大カテゴリ（業界）と小カテゴリ（条件）の分離
   - 例: 「業界: 金融、商社、メーカー」「条件: まだ間に合う、転勤あり」

2. **AND 条件フィルタの追加**
   - 設定で OR/AND を切り替え可能に
   - 例: 金融 AND まだ間に合う → より絞り込まれた結果

3. **フィルタ状態のURL保存**
   - Next.js の searchParams を使用
   - 共有可能なフィルタ結果URL

4. **レスポンシブ対応の強化**
   - モバイルでタグが多い場合のUI改善
   - ドロップダウン形式への切り替えオプション

### 技術的な注意点
- **Server/Client 境界**: データ取得は Server、インタラクションは Client で分離
- **パフォーマンス**: 企業数が増えた場合は仮想スクロール (react-window) を検討
- **アクセシビリティ**: キーボード操作やスクリーンリーダー対応は未実装

---

## 📚 参考リンク
- [Next.js 15 - Server and Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
- [React useMemo Hook](https://react.dev/reference/react/useMemo)
- [Playwright Testing Library](https://playwright.dev/)

---

## 📊 統計情報

- **開発時間**: 約1セッション
- **作成ファイル数**: 2ファイル（CompanyCalendar.tsx, FilterBar.tsx）
- **修正ファイル数**: 2ファイル（page.tsx, globals.css）
- **テストケース数**: 6（新規）、11（合計）
- **テスト実行時間**: 6.6秒
- **コード行数**:
  - CompanyCalendar.tsx: 58行
  - FilterBar.tsx: 44行
  - CSS追加: 70行
