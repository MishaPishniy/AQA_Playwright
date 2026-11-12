import { test as base, expect, type Page } from "@playwright/test";
import { mockFruits } from "../utils/mocks/apiMocksFruits";

type MyFixtures = {
  mockedPage: Page;
};

export const test = base.extend<MyFixtures>({
  mockedPage: async ({ page }, use) => {
    await mockFruits(page, [
      { id: 1, name: "Apple" },
      { id: 2, name: "Orange" },
    ]);

    await use(page);
  },
});

export { expect };
