import type { Page } from '@playwright/test';

export async function mockFruits(
  page: Page,
  fruits: { id: number; name: string }[]
) {
  await page.route('**/api/v1/fruits', async route => {
    await route.fulfill({
      status: 200,
      json: fruits,
    });
  });
}