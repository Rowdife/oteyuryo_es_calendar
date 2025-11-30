import { test, expect } from '@playwright/test';

test.describe('人気企業ESカレンダー - ホームページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1. Webページのタイトルが"人気企業ESカレンダー"', async ({ page }) => {
    await expect(page).toHaveTitle('人気企業ESカレンダー');
  });

  test('2. リスト形式で企業が10社表示されている', async ({ page }) => {
    // data-testid="company-item" を持つ要素が10個あることを確認
    const companyItems = page.locator('[data-testid="company-item"]');
    await expect(companyItems).toHaveCount(10);
  });

  test('3. 企業のエントリー締切日が表示されている', async ({ page }) => {
    // 最初の企業に締切日が表示されていることを確認
    const firstCompany = page.locator('[data-testid="company-item"]').first();
    const deadline = firstCompany.locator('[data-testid="deadline"]');
    await expect(deadline).toBeVisible();

    // 締切日のテキストが存在することを確認（例: "2025-03-09 23:59"）
    await expect(deadline).not.toHaveText('');
  });

  test('4. 企業に最低一つのタグが付けられている', async ({ page }) => {
    // 最初の企業にタグが表示されていることを確認
    const firstCompany = page.locator('[data-testid="company-item"]').first();
    const tags = firstCompany.locator('[data-testid="tag"]');

    // 少なくとも1つのタグがあることを確認
    await expect(tags).toHaveCount(await tags.count());
    await expect(tags.first()).toBeVisible();
  });

  test('5. 企業をクリックしたら、その企業の公式ホームページに飛ぶ', async ({ page, context }) => {
    // 最初の企業リンクを取得
    const firstCompanyLink = page.locator('[data-testid="company-link"]').first();

    // リンクのhref属性を確認
    const href = await firstCompanyLink.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).toMatch(/^https?:\/\//); // URLであることを確認

    // 新しいタブで開くことを確認（target="_blank"）
    const target = await firstCompanyLink.getAttribute('target');
    expect(target).toBe('_blank');
  });
});
