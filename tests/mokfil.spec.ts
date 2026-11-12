import { test, expect } from '@playwright/test';
import { mockFruits } from '../utils/mocks/apiMocksFruits';

test('Mock fruits', async ({ page }) => {
  await mockFruits(page, [
    { id: 1, name: "Apple" },
    { id: 2, name: "Orange" },
  ]);

  await page.goto(
    'https://demo.playwright.dev/api-mocking/'
  );

  await expect(
    page.getByText('Orange')
  ).toBeVisible();
});