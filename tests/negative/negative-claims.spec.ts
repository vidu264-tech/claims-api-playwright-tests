import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/apiClient';
import { obtainAccessToken } from '../../src/auth';

test.describe('Negative Claim Scenarios', () => {

  test('claim not found should return 404', async ({ request }) => {
    const api = new ApiClient(request);
    const token = await obtainAccessToken(api);

    const { status, body } = await api.getClaim(token, 'c99999');

    expect(status).toBe(404);
    expect(body.code).toBe('NOT_FOUND');
  });

  test('invalid claim ID format should return 400', async ({ request }) => {
    const api = new ApiClient(request);
    const token = await obtainAccessToken(api);

    const { status, body } = await api.getClaim(token, '123');

    expect(status).toBe(400);
    expect(body.code).toBe('BAD_REQUEST');
  });

});
