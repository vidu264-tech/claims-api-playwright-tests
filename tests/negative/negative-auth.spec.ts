import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/apiClient';

test.describe('Negative Auth Scenarios', () => {

  test('invalid credentials should return 401', async ({ request }) => {
    const api = new ApiClient(request);

    const { status, body } = await api.login('user', 'wrongpass');

    expect(status).toBe(401);
    expect(body.code).toBe('UNAUTHORIZED');
  });

  test('missing token should return 401 on protected route', async ({ request }) => {
    const api = new ApiClient(request);

    // sending empty token leads to invalid Bearer token
    const { status, body } = await api.createClaim('', {
      policyNumber: 'P-NEG-1',
      claimantName: 'No Token User',
      damageDate: '2025-11-10',
      lossDescription: 'Unauthorized attempt'
    });

    expect(status).toBe(401);
    expect(body.code).toBe('UNAUTHORIZED');
  });

});
