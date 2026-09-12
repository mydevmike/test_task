import { test as base, expect } from '@playwright/test';
import { AccountApi } from '../api/AccountApi';
import { BookStoreApi } from '../api/BookStoreApi';
import type { AuthorizedUser, CreatedUser } from '../api/types';
import { createUniqueCredentials } from '../data/credentials';
import { HomePage } from '../pages/HomePage';
import { WebTablesPage } from '../pages/WebTablesPage';

async function deleteUserOrThrow(
  accountApi: AccountApi,
  userId: string,
  token: string,
): Promise<void> {
  const response = await accountApi.deleteUser(userId, token);
  const status = response.status();
  if (status !== 200 && status !== 204) {
    throw new Error(
      `Failed to cleanup DemoQA user ${userId}: expected 200 or 204, got ${status}`,
    );
  }
}

type Fixtures = {
  homePage: HomePage;
  webTablesPage: WebTablesPage;
  accountApi: AccountApi;
  bookStoreApi: BookStoreApi;
  createdUser: CreatedUser;
  authorizedUser: AuthorizedUser;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  webTablesPage: async ({ page }, use) => {
    await use(new WebTablesPage(page));
  },

  accountApi: async ({ request }, use) => {
    await use(new AccountApi(request));
  },

  bookStoreApi: async ({ request }, use) => {
    await use(new BookStoreApi(request));
  },

  createdUser: async ({ accountApi }, use) => {
    const credentials = createUniqueCredentials();
    const created = await accountApi.createUserJson(credentials);
    expect(created.status).toBe(201);

    await use({
      userId: created.body.userID,
      userName: credentials.userName,
      password: credentials.password,
    });
  },

  authorizedUser: async ({ createdUser, accountApi }, use) => {
    let token: string | undefined;

    try {
      const tokenResult = await accountApi.generateTokenJson({
        userName: createdUser.userName,
        password: createdUser.password,
      });
      expect(tokenResult.status).toBe(200);
      expect(tokenResult.body.token).toBeTruthy();
      token = tokenResult.body.token;

      await use({
        ...createdUser,
        token,
      });
    } finally {
      // Token may be missing if generateToken failed after user creation — retry once for cleanup.
      if (!token) {
        const cleanupToken = await accountApi.generateTokenJson({
          userName: createdUser.userName,
          password: createdUser.password,
        });
        if (cleanupToken.status === 200 && cleanupToken.body.token) {
          token = cleanupToken.body.token;
        }
      }

      if (createdUser.userId && token) {
        await deleteUserOrThrow(accountApi, createdUser.userId, token);
      }
    }
  },
});

export { expect } from '@playwright/test';
