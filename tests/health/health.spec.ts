import { test, expect } from '@playwright/test';

test.describe('TC8 - Health Endpoint', () => {
  test('GET /health should return { status: "ok" }', async ({ request }) => {
    const res = await request.get('/health');

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.status).toBe('ok');
  });
});
