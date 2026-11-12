import { test, expect } from "@playwright/test";

test("Custom API context", async ({ playwright }) => {
  const apiContext = await playwright.request.newContext({
    baseURL: "https://jsonplaceholder.typicode.com",
    extraHTTPHeaders: {
      Accept: "application/json",
    },

    timeout: 10000,
  });

  try {
    const response = await apiContext.get("/posts/1");

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.id).toBe(1);
  } finally {
    await apiContext.dispose();
  }
});
