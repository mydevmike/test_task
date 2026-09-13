import { randomUUID } from 'crypto';

/** Credentials accepted by DemoQA Account API (password policy). */
export type UserCredentials = {
  userName: string;
  password: string;
};

/** Valid password: length, digit, upper case, special char. */
export const VALID_PASSWORD = 'Passw0rd!';

/** Intentionally invalid password for negative create-user scenario. */
export const INVALID_PASSWORD = '123';

/**
 * ISBN from DemoQA catalog (Git Pocket Guide).
 * Catalog is shared/read-only; using a fixed ISBN keeps book tests deterministic.
 */
export const TEST_ISBN = '9781449325862';

export function createUniqueCredentials(
  password: string = VALID_PASSWORD,
): UserCredentials {
  return {
    userName: `aqa_${randomUUID().replace(/-/g, '').slice(0, 12)}`,
    password,
  };
}
