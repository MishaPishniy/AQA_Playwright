import { test, expect } from "@playwright/test";

test("Request", async ({ request }) => {
  const response = await request.get(
    "https://jsonplaceholder.typicode.com/posts/1",
  );
  expect(response.status()).toBe(200);
  await expect(response).toBeOK();

  const body = await response.json();

  expect(body.id).toBe(1);
});

test("GET all posts", async ({ request }) => {
  const response = await request.get(
    "https://jsonplaceholder.typicode.com/posts",
  );

  expect(response.status()).toBe(200);

  const posts = await response.json();

  expect(Array.isArray(posts)).toBe(true);

  expect(posts.length).toBeGreaterThan(0);

  expect(posts[0]).toEqual(
    expect.objectContaining({
      id: expect.any(Number),
      title: expect.any(String),
    }),
  );
});

test("POST create new post", async ({ request }) => {
  const newPost = {
    title: "Playwright API Testing",
    body: "Learning API automation",
    userId: 1,
  };

  const response = await request.post(
    "https://jsonplaceholder.typicode.com/posts",
    {
      data: newPost
    },
  );

  expect(response.status()).toBe(201);

  const body = await response.json();

  expect(body.title).toBe(newPost.title);
  expect(body.body).toBe(newPost.body);
  expect(body.userId).toBe(newPost.userId);
  expect(body.id).toBeDefined();
});


test('GET non-existing post', async ({ request }) => {

  const response = await request.get(
    'https://jsonplaceholder.typicode.com/posts/999999'
  );

  expect(response.status()).toBe(404);
});
