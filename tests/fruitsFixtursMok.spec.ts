import { test, expect } from '../fixtures/testMockFixtures';

test('Check mocked fruits', async ({ mockedPage }) => {

  await mockedPage.goto(
    'https://demo.playwright.dev/api-mocking/'
  );

  await expect(
    mockedPage.getByText('Orange')
  ).toBeVisible();

});