export type CreateUserRequest = {
  userName: string;
  password: string;
};

export type CreateUserResponse = {
  /** Actual DemoQA response field (capital ID). */
  userID: string;
  username: string;
  books: unknown[];
};

export type GenerateTokenRequest = {
  userName: string;
  password: string;
};

export type GenerateTokenResponse = {
  token: string;
  expires: string;
  status: string;
  result: string;
};

export type AddBooksRequest = {
  userId: string;
  collectionOfIsbns: Array<{ isbn: string }>;
};

export type AddBooksResponse = {
  books: Array<{ isbn: string }>;
};

export type GetUserResponse = {
  userId: string;
  username: string;
  books: Array<{ isbn: string; title?: string }>;
};

export type ErrorResponse = {
  /** DemoQA may serialize this as a string despite swagger saying number. */
  code: number | string;
  message: string;
};

export type CreatedUser = {
  userId: string;
  userName: string;
  password: string;
};

export type AuthorizedUser = CreatedUser & {
  token: string;
};
