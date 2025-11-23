import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/apiClient';
import { obtainAccessToken } from '../../src/auth';

test.describe('TC5 - Update Claim Status Step-by-Step', () => {

  test('OPEN -> IN_REVIEW -> APPROVED -> PAID', async ({ request }) => {
    const api = new ApiClient(request);
    const token = await obtainAccessToken(api);

    // Create a new claim
    const created = await api.createClaim(token, {
      policyNumber: `P-FLOW-${Date.now()}`,
      claimantName: 'Flow Tester',
      damageDate: '2025-11-10',
      lossDescription: 'Test flow'
    });

    expect(created.status).toBe(201);
    const id = created.body.id;

    // OPEN -> IN_REVIEW
    let res = await api.patchClaim(token, id, { status: 'IN_REVIEW' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('IN_REVIEW');

    const updated1 = res.body.updatedAt;

    // IN_REVIEW -> APPROVED
    res = await api.patchClaim(token, id, { status: 'APPROVED' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('APPROVED');

    const updated2 = res.body.updatedAt;
    expect(updated2).not.toBe(updated1);

    // APPROVED -> PAID
    res = await api.patchClaim(token, id, { status: 'PAID' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('PAID');
  });

  test('illegal transition returns 400', async ({ request }) => {
    const api = new ApiClient(request);
    const token = await obtainAccessToken(api);

    // Create & move to PAID
    const c = await api.createClaim(token, {
      policyNumber: `P-ILLEGAL-${Date.now()}`,
      claimantName: 'Illegal Tester',
      damageDate: '2025-11-10',
      lossDescription: 'Test illegal transitions'
    });

    const id = c.body.id;

    await api.patchClaim(token, id, { status: 'IN_REVIEW' });
    await api.patchClaim(token, id, { status: 'APPROVED' });
    await api.patchClaim(token, id, { status: 'PAID' });

    // Illegal transition PAID -> OPEN
    const res = await api.patchClaim(token, id, { status: 'OPEN' });
    expect(res.status).toBe(400);
  });

});
