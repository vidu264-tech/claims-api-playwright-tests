import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/apiClient';
import { obtainAccessToken } from '../../src/auth';

test.describe('TC6 - Pagination', () => {
  test('should return paginated claims and X-Total-Count', async ({ request }) => {
    const api = new ApiClient(request);
    const token = await obtainAccessToken(api);

    // Create multiple claims
    for (let i = 0; i < 5; i++) {
      await api.createClaim(token, {
        policyNumber: `P-PAGE-${Date.now()}-${i}`,
        claimantName: 'Pager',
        damageDate: '2025-11-10',
        lossDescription: 'Pagination test'
      });
    }

    const { status, body, headers } = await api.listClaims(token, {
      page: 1,
      pageSize: 3
    });

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(Number(headers['x-total-count'] || 0)).toBeGreaterThan(0);
  });

  test('pageSize=0 should return 400', async ({ request }) => {
    const api = new ApiClient(request);
    const token = await obtainAccessToken(api);

    const { status } = await api.listClaims(token, { pageSize: 0 });

    expect(status).toBe(400);
  });
});
