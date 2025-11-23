import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/apiClient';
import { obtainAccessToken } from '../../src/auth';
import { validateSchema } from '../../src/utils';
import { ClaimSchema } from '../../src/schemas';

test.describe('TC1 - Create Claim (Happy Path)', () => {
  test('should create a claim and return 201 with Claim schema', async ({ request }) => {
    const api = new ApiClient(request);
    const token = await obtainAccessToken(api);

    const payload = {
      policyNumber: 'P-10003',
      claimantName: 'Jane Doe',
      damageDate: '2025-11-10',
      lossDescription: 'Water damage in kitchen'
    };

    const { status, body } = await api.createClaim(token, payload);

    expect(status).toBe(201);

    const { valid, errors } = validateSchema(ClaimSchema, body);
    expect(valid, JSON.stringify(errors)).toBe(true);

    expect(body.id).toBeTruthy();
    expect(body.status).toBe('OPEN');
  });
});
