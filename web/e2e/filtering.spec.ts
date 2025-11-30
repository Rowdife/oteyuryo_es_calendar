import { test, expect } from '@playwright/test';

test.describe('タグフィルタリング機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1. タグフィルタが表示されている', async ({ page }) => {
    const filterBar = page.locator('[data-testid="filter-bar"]');
    await expect(filterBar).toBeVisible();

    // 少なくとも1つのフィルタタグが表示されていること
    const filterTags = page.locator('[data-testid="filter-tag"]');
    await expect(filterTags.first()).toBeVisible();
  });

  test('2. タグをクリックするとフィルタリングされる', async ({ page }) => {
    // 初期状態：10社すべて表示
    const companyItems = page.locator('[data-testid="company-item"]');
    await expect(companyItems).toHaveCount(10);

    // 「金融」タグをクリック
    await page.locator('[data-testid="filter-tag"]', { hasText: '金融' }).click();

    // フィルタリング後：金融タグを持つ企業のみ表示
    // モックデータから：三菱UFJ、三井住友FG = 2社
    await expect(companyItems).toHaveCount(2);
  });

  test('3. 複数タグを選択するとOR条件でフィルタリングされる', async ({ page }) => {
    const companyItems = page.locator('[data-testid="company-item"]');

    // 「金融」タグをクリック
    await page.locator('[data-testid="filter-tag"]', { hasText: '金融' }).click();
    await expect(companyItems).toHaveCount(2); // 金融: 2社

    // 「商社」タグをクリック
    await page.locator('[data-testid="filter-tag"]', { hasText: '商社' }).click();
    await expect(companyItems).toHaveCount(4); // 金融2社 + 商社2社 = 4社
  });

  test('4. 選択中のタグが視覚的に分かる', async ({ page }) => {
    const kinnyuTag = page.locator('[data-testid="filter-tag"]', { hasText: '金融' });

    // クリック前：activeクラスがない
    await expect(kinnyuTag).not.toHaveClass(/active/);

    // クリック後：activeクラスが付与される
    await kinnyuTag.click();
    await expect(kinnyuTag).toHaveClass(/active/);
  });

  test('5. 選択中のタグを再クリックするとフィルタ解除される', async ({ page }) => {
    const companyItems = page.locator('[data-testid="company-item"]');
    const kinnyuTag = page.locator('[data-testid="filter-tag"]', { hasText: '金融' });

    // 金融タグをクリック
    await kinnyuTag.click();
    await expect(companyItems).toHaveCount(2);

    // 再度クリック（解除）
    await kinnyuTag.click();
    await expect(companyItems).toHaveCount(10); // 全企業が再表示
  });

  test('6. 「すべて表示」ボタンでフィルタがクリアされる', async ({ page }) => {
    const companyItems = page.locator('[data-testid="company-item"]');

    // 金融タグをクリック
    await page.locator('[data-testid="filter-tag"]', { hasText: '金融' }).click();
    await expect(companyItems).toHaveCount(2);

    // 「すべて表示」ボタンをクリック
    await page.locator('[data-testid="clear-filter"]').click();
    await expect(companyItems).toHaveCount(10);
  });
});
