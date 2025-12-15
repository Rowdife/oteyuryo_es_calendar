import { test, expect } from "@playwright/test";

test.describe("大手企業・優良企業ESカレンダー - ホームページ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test('1. Webページのタイトルが"大手企業・優良企業ESカレンダー"を含む', async ({
    page,
  }) => {
    await expect(page).toHaveTitle(/大手企業・優良企業ESカレンダー/);
  });

  test("2. リスト形式で募集が表示されている", async ({ page }) => {
    // data-testid="posting-card" を持つ要素が存在することを確認
    const postingCards = page.locator('[data-testid="posting-card"]');
    const count = await postingCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("3. 募集の締切日が表示されている", async ({ page }) => {
    // 最初の募集に締切日が表示されていることを確認
    const firstPosting = page.locator('[data-testid="posting-card"]').first();
    const deadline = firstPosting.locator('[data-testid="deadline"]');
    await expect(deadline).toBeVisible();

    // 締切日のテキストが存在することを確認
    await expect(deadline).not.toHaveText("");
  });

  test("4. 募集に最低一つのタグが付けられている", async ({ page }) => {
    // 最初の募集にタグが表示されていることを確認
    const firstPosting = page.locator('[data-testid="posting-card"]').first();
    const tags = firstPosting.locator('[data-testid="tag"]');

    // 少なくとも1つのタグがあることを確認
    const tagCount = await tags.count();
    expect(tagCount).toBeGreaterThan(0);
    await expect(tags.first()).toBeVisible();
  });

  test("5. 募集をクリックしたら詳細ページに遷移する", async ({ page }) => {
    // 最初の募集リンクをクリック
    const firstPostingLink = page
      .locator('[data-testid="posting-link"]')
      .first();
    await firstPostingLink.click();

    // 詳細ページに遷移することを確認
    await expect(page).toHaveURL(/\/p\/\d+/);
    await expect(page.locator('[data-testid="posting-detail"]')).toBeVisible();
  });

  test("6. 公式リンクをクリックしたら外部サイトが開く", async ({ page }) => {
    // 最初の募集のESを提出しに行くボタンを取得
    const firstOfficialLink = page
      .locator('[data-testid="submit-cta"]')
      .first();

    // リンクのhref属性を確認
    const href = await firstOfficialLink.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).toMatch(/^https?:\/\//);

    // 新しいタブで開くことを確認
    const target = await firstOfficialLink.getAttribute("target");
    expect(target).toBe("_blank");
  });

  test("7. 募集が締切日順（昇順）でソートされている", async ({ page }) => {
    const postingCards = page.locator('[data-testid="posting-card"]');
    const count = await postingCards.count();

    // 少なくとも2件以上あることを確認
    expect(count).toBeGreaterThanOrEqual(2);

    // 各募集の締切日を取得
    const deadlines: string[] = [];
    for (let i = 0; i < count; i++) {
      const deadlineElement = postingCards
        .nth(i)
        .locator('[data-testid="deadline"]');
      const dateTime = await deadlineElement.getAttribute("dateTime");
      if (dateTime) {
        deadlines.push(dateTime);
      }
    }

    // ソートされていることを確認
    for (let i = 1; i < deadlines.length; i++) {
      const prevDate = deadlines[i - 1];
      const currentDate = deadlines[i];
      expect(currentDate >= prevDate).toBeTruthy();
    }
  });

  test("8. 企業名と募集タイトルが表示されている", async ({ page }) => {
    const firstPosting = page.locator('[data-testid="posting-card"]').first();

    // 企業名
    const companyName = firstPosting.locator('[data-testid="company-name"]');
    await expect(companyName).toBeVisible();
    await expect(companyName).not.toHaveText("");

    // 募集タイトル
    const postingTitle = firstPosting.locator('[data-testid="posting-title"]');
    await expect(postingTitle).toBeVisible();
    await expect(postingTitle).not.toHaveText("");
  });
});
