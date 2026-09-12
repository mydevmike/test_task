import type { APIRequestContext, APIResponse } from '@playwright/test';
import type {
  CreateUserRequest,
  CreateUserResponse,
  GenerateTokenRequest,
  GenerateTokenResponse,
  GetUserResponse,
} from './types';

export class AccountApi {
  constructor(private readonly request: APIRequestContext) {}

  createUser(body: CreateUserRequest): Promise<APIResponse> {
    return this.request.post('/Account/v1/User', { data: body });
  }

  generateToken(body: GenerateTokenRequest): Promise<APIResponse> {
    return this.request.post('/Account/v1/GenerateToken', { data: body });
  }

  getUser(userId: string, token: string): Promise<APIResponse> {
    return this.request.get(`/Account/v1/User/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  deleteUser(userId: string, token: string): Promise<APIResponse> {
    return this.request.delete(`/Account/v1/User/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async createUserJson(body: CreateUserRequest): Promise<{
    status: number;
    body: CreateUserResponse;
  }> {
    const response = await this.createUser(body);
    return { status: response.status(), body: (await response.json()) as CreateUserResponse };
  }

  async generateTokenJson(body: GenerateTokenRequest): Promise<{
    status: number;
    body: GenerateTokenResponse;
  }> {
    const response = await this.generateToken(body);
    return {
      status: response.status(),
      body: (await response.json()) as GenerateTokenResponse,
    };
  }

  async getUserJson(
    userId: string,
    token: string,
  ): Promise<{ status: number; body: GetUserResponse }> {
    const response = await this.getUser(userId, token);
    return { status: response.status(), body: (await response.json()) as GetUserResponse };
  }
}
