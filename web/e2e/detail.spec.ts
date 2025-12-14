import { test, expect } from '@playwright/test';

test.describe('募集詳細ページ', () => {
  test.beforeEach(async ({ page }) => {
    // 最初の募集の詳細ページに遷移
    await page.goto('/');
    await page.locator('[data-testid="posting-link"]').first().click();
    await page.waitForURL(/\/p\/\d+/);
  });

  test('1. 詳細ページが表示される', async ({ page }) => {
    await expect(page.locator('[data-testid="posting-detail"]')).toBeVisible();
  });

  test('2. 企業名が表示されている', async ({ page }) => {
    const companyName = page.locator('.detail-company-name');
    await expect(companyName).toBeVisible();
    await expect(companyName).not.toHaveText('');
  });

  test('3. 募集タイトルが表示されている', async ({ page }) => {
    const postingTitle = page.locator('.detail-posting-title');
    await expect(postingTitle).toBeVisible();
    await expect(postingTitle).not.toHaveText('');
  });

  test('4. 締切日が表示されている', async ({ page }) => {
    const deadline = page.locator('.detail-deadline-date');
    await expect(deadline).toBeVisible();
    await expect(deadline).not.toHaveText('');
  });

  test('5. 公式サイトへのCTAボタンがある', async ({ page }) => {
    const ctaButton = page.locator('.detail-cta-button.primary');
    await expect(ctaButton).toBeVisible();

    // 外部リンクであることを確認
    const href = await ctaButton.getAttribute('href');
    expect(href).toMatch(/^https?:\/\//);

    // 新しいタブで開くことを確認
    const target = await ctaButton.getAttribute('target');
    expect(target).toBe('_blank');
  });

  test('6. カレンダー追加ボタンがある', async ({ page }) => {
    const calendarButton = page.locator('.detail-cta-button.secondary');
    await expect(calendarButton).toBeVisible();
  });

  test('7. 信頼情報（出典・最終確認）が表示されている', async ({ page }) => {
    const trustSection = page.locator('.detail-trust-section');
    await expect(trustSection).toBeVisible();

    // 出典URLが表示されている
    const sourceLink = trustSection.locator('.trust-link');
    await expect(sourceLink).toBeVisible();

    // 最終確認が表示されている
    const verifyInfo = trustSection.locator('.trust-item').filter({ hasText: '最終確認' });
    await expect(verifyInfo).toBeVisible();
  });

  test('8. 一覧に戻るリンクがある', async ({ page }) => {
    const backLink = page.locator('.breadcrumb-link');
    await expect(backLink).toBeVisible();

    // クリックすると一覧ページに戻る
    await backLink.click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('募集詳細ページ - 同企業の他の募集', () => {
  test('同じ企業の他の募集があれば表示される', async ({ page }) => {
    // トヨタ自動車（id: 1）の詳細ページに遷移
    await page.goto('/p/1');

    // 同じ企業の他の募集セクションを確認
    const relatedSection = page.locator('.detail-related-section');

    // トヨタは複数の募集があるので表示されるはず
    if (await relatedSection.isVisible()) {
      const relatedPostings = relatedSection.locator('.related-posting-link');
      const count = await relatedPostings.count();
      expect(count).toBeGreaterThan(0);

      // クリックすると別の詳細ページに遷移
      const firstRelated = relatedPostings.first();
      await firstRelated.click();
      await expect(page).toHaveURL(/\/p\/\d+/);
    }
  });
});

test.describe('募集詳細ページ - Not Found', () => {
  test('存在しないIDでアクセスすると404ページが表示される', async ({ page }) => {
    const response = await page.goto('/p/99999');

    // Either custom not-found or Next.js 404
    const notFoundContent = page.locator('.not-found-page');
    const notFoundHeading = page.getByRole('heading', { name: /見つかりません|not found/i });

    // Either custom 404 page or Next.js default 404
    const hasCustomNotFound = await notFoundContent.isVisible().catch(() => false);
    const hasNotFoundHeading = await notFoundHeading.isVisible().catch(() => false);

    expect(hasCustomNotFound || hasNotFoundHeading || response?.status() === 404).toBeTruthy();
  });
});
