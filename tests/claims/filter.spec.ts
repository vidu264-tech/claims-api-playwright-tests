import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/apiClient';
import { obtainAccessToken } from '../../src/auth';

test.describe('TC7 - Filter Claims by Status', () => {

  test('should return only APPROVED claims', async ({ request }) => {
    const api = new ApiClient(request);
    const token = await obtainAccessToken(api);

    // Create claim -> IN_REVIEW -> APPROVED
    const created = await api.createClaim(token, {
      policyNumber: `P-FILTER-${Date.now()}`,
      claimantName: 'Filter Tester',
      damageDate: '2025-11-10',
      lossDescription: 'Filter test'
    });

    const id = created.body.id;

    await api.patchClaim(token, id, { status: 'IN_REVIEW' });
    await api.patchClaim(token, id, { status: 'APPROVED' });

    const { status, body } = await api.listClaims(token, { status: 'APPROVED' });

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.every((c: any) => c.status === 'APPROVED')).toBe(true);
  });

  test('unknown status should return 400', async ({ request }) => {
    const api = new ApiClient(request);
    const token = await obtainAccessToken(api);

    const { status } = await api.listClaims(token, { status: 'INVALID' });

    expect(status).toBe(400);
  });

});
