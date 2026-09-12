import {
  createUniqueCredentials,
  INVALID_PASSWORD,
  VALID_PASSWORD,
} from '../../src/data/credentials';
import type { CreateUserResponse, ErrorResponse } from '../../src/api/types';
import { expect, test } from '../../src/fixtures/test';

test.describe('Account API', () => {
  test('creates a user successfully', async ({ accountApi }) => {
    const credentials = createUniqueCredentials(VALID_PASSWORD);
    let userId: string | undefined;
    let token: string | undefined;

    try {
      const response = await accountApi.createUser(credentials);
      expect(response.status()).toBe(201);

      const body = (await response.json()) as CreateUserResponse;
      userId = body.userID;
      expect(userId).toBeTruthy();
      expect(body.username).toBe(credentials.userName);
      expect(body.books).toEqual([]);

      const tokenResult = await accountApi.generateTokenJson(credentials);
      expect(tokenResult.status).toBe(200);
      token = tokenResult.body.token;
    } finally {
      if (userId && token) {
        const deleteResponse = await accountApi.deleteUser(userId, token);
        const status = deleteResponse.status();
        expect(
          [200, 204],
          `Failed to cleanup DemoQA user ${userId}: expected 200 or 204, got ${status}`,
        ).toContain(status);
      }
    }
  });

  test('rejects user creation with invalid password', async ({ accountApi }) => {
    const credentials = createUniqueCredentials(INVALID_PASSWORD);

    const response = await accountApi.createUser(credentials);
    expect(response.status()).toBe(400);

    const body = (await response.json()) as ErrorResponse;
    expect(Number(body.code)).toBe(1300);
    expect(body.message).toMatch(/passwords must have at least one/i);
  });
});
