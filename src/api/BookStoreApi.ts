import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { AddBooksRequest, AddBooksResponse } from './types';

export class BookStoreApi {
  constructor(private readonly request: APIRequestContext) {}

  addBooks(body: AddBooksRequest, token: string): Promise<APIResponse> {
    return this.request.post('/BookStore/v1/Books', {
      data: body,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  /** DELETE /BookStore/v1/Books?UserId= — removes all books for the user. */
  deleteBooks(userId: string, token: string): Promise<APIResponse> {
    return this.request.delete('/BookStore/v1/Books', {
      params: { UserId: userId },
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async addBooksJson(
    body: AddBooksRequest,
    token: string,
  ): Promise<{ status: number; body: AddBooksResponse }> {
    const response = await this.addBooks(body, token);
    return { status: response.status(), body: (await response.json()) as AddBooksResponse };
  }
}
