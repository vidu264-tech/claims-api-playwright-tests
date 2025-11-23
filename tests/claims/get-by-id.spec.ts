import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/apiClient';
import { obtainAccessToken } from '../../src/auth';
import { ClaimSchema } from '../../src/schemas';
import { validateSchema } from '../../src/utils';

test.describe('TC4 - Retrieve Claim by ID', () => {
  test('should return claim c001', async ({ request }) => {
    const api = new ApiClient(request);
    const token = await obtainAccessToken(api);

    const { status, body } = await api.getClaim(token, 'c001');

    expect(status).toBe(200);

    const { valid, errors } = validateSchema(ClaimSchema, body);
    expect(valid, JSON.stringify(errors)).toBe(true);

    expect(body.id).toBe('c001');
  });
});
