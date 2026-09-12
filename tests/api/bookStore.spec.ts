import { TEST_ISBN } from '../../src/data/credentials';
import type { ErrorResponse } from '../../src/api/types';
import { expect, test } from '../../src/fixtures/test';

test.describe('BookStore API', () => {
  test('adds a book to an authorized user', async ({
    authorizedUser,
    bookStoreApi,
    accountApi,
  }) => {
    const response = await bookStoreApi.addBooks(
      {
        userId: authorizedUser.userId,
        collectionOfIsbns: [{ isbn: TEST_ISBN }],
      },
      authorizedUser.token,
    );

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.books).toEqual([{ isbn: TEST_ISBN }]);

    const user = await accountApi.getUserJson(authorizedUser.userId, authorizedUser.token);
    expect(user.status).toBe(200);
    expect(user.body.books.map((book) => book.isbn)).toContain(TEST_ISBN);
  });

  test('deletes all books for an authorized user', async ({
    authorizedUser,
    bookStoreApi,
    accountApi,
  }) => {
    const addResponse = await bookStoreApi.addBooks(
      {
        userId: authorizedUser.userId,
        collectionOfIsbns: [{ isbn: TEST_ISBN }],
      },
      authorizedUser.token,
    );
    expect(addResponse.status()).toBe(201);

    const deleteResponse = await bookStoreApi.deleteBooks(
      authorizedUser.userId,
      authorizedUser.token,
    );
    expect(deleteResponse.status()).toBe(204);

    const user = await accountApi.getUserJson(authorizedUser.userId, authorizedUser.token);
    expect(user.status).toBe(200);
    expect(user.body.books).toEqual([]);
  });

  test('rejects adding a book without authorization', async ({ request }) => {
    // No token on purpose; userId can be any UUID — auth fails before resource checks.
    const response = await request.post('/BookStore/v1/Books', {
      data: {
        userId: '00000000-0000-0000-0000-000000000000',
        collectionOfIsbns: [{ isbn: TEST_ISBN }],
      },
    });

    expect(response.status()).toBe(401);
    const body = (await response.json()) as ErrorResponse;
    expect(Number(body.code)).toBe(1200);
    expect(body.message).toBe('User not authorized!');
  });
});
