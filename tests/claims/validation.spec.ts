import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/apiClient';
import { obtainAccessToken } from '../../src/auth';
import { ErrorSchema } from '../../src/schemas';
import { validateSchema } from '../../src/utils';

test.describe('TC2 & TC3 - Validation Errors', () => {

  test('TC2 - Missing policyNumber should return 400', async ({ request }) => {
    const api = new ApiClient(request);
    const token = await obtainAccessToken(api);

    const payload = {
      claimantName: 'John Doe',
      damageDate: '2025-11-10',
      lossDescription: 'Car accident'
    };

    const { status, body } = await api.createClaim(token, payload);

    expect(status).toBe(400);

    const { valid } = validateSchema(ErrorSchema, body);
    expect(valid).toBe(true);
  });

  test('TC3 - Invalid damageDate format returns 400', async ({ request }) => {
    const api = new ApiClient(request);
    const token = await obtainAccessToken(api);

    const payload = {
      policyNumber: 'P-10004',
      claimantName: 'Jane Smith',
      damageDate: '11-10-2025',
      lossDescription: 'Glass door broken'
    };

    const { status, body } = await api.createClaim(token, payload);

    expect(status).toBe(400);

    const { valid } = validateSchema(ErrorSchema, body);
    expect(valid).toBe(true);
  });

});
