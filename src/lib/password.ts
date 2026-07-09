import { hash, verify } from '@node-rs/argon2';

/**
 * Password hashing (Section 8.3). Argon2id with sensible interactive-login
 * parameters. Passwords are never stored or logged in plain text.
 */
const OPTS = {
  memoryCost: 19456, // ~19 MiB
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
} as const;

export function hashPassword(plain: string): Promise<string> {
  return hash(plain, OPTS);
}

export function verifyPassword(hashString: string, plain: string): Promise<boolean> {
  return verify(hashString, plain, OPTS);
}
