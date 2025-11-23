import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/apiClient';
import { validateSchema } from '../../src/utils';
import { LoginResponseSchema } from '../../src/schemas';

test.describe('Authentication', () => {
  test('POST /auth/login should return accessToken (TC Auth)', async ({ request }) => {
    const api = new ApiClient(request);

    const { status, body } = await api.login('user', 'pass');

    expect(status).toBe(200);

    const { valid, errors } = validateSchema(LoginResponseSchema, body);
    expect(valid, JSON.stringify(errors)).toBe(true);

    expect(typeof body.accessToken).toBe('string');
    expect(body.accessToken.length).toBeGreaterThan(0);
  });
});
