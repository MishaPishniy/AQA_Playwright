import { test, expect } from "@playwright/test";

test("localStorage" , async ({page}) => {

    await page.goto("https://www.saucedemo.com/");
    await page.evaluate(() => {
        localStorage.setItem("key", "value");
    });
    const value = await page.evaluate(() => {
        return localStorage.getItem("key");
    });
    expect(value).toBe("value");
})

test("SessionStorage " , async ({page}) => {

    await page.goto("https://www.saucedemo.com/");
    await page.evaluate(() => {
        sessionStorage.setItem("key", "value");
    });

    await page.reload();

    const value = await page.evaluate(() => {
        return sessionStorage.getItem("key");
    });
    expect(value).toBe("value");
})


