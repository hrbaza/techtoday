import crypto from "node:crypto";
import { cookies } from "next/headers";

// Single-user admin login. The password lives only in the ADMIN_PASSWORD env
// var; the session cookie is an expiry timestamp signed with a key derived from
// it, so changing the password signs everyone out.

export const SESSION_COOKIE = "tt_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function signingKey(): Buffer | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return crypto.createHash("sha256").update(`techtoday-admin:${password}`).digest();
}

function sign(value: string, key: Buffer): string {
  return crypto.createHmac("sha256", key).update(value).digest("base64url");
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkPassword(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const a = crypto.createHash("sha256").update(input).digest();
  const b = crypto.createHash("sha256").update(password).digest();
  return crypto.timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const key = signingKey();
  if (!key) throw new Error("ADMIN_PASSWORD is not set");
  const expires = String(Date.now() + MAX_AGE_SECONDS * 1000);
  return `${expires}.${sign(expires, key)}`;
}

function isValidToken(token: string | undefined): boolean {
  const key = signingKey();
  if (!key || !token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  const expected = Buffer.from(sign(expires, key));
  const actual = Buffer.from(signature);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return isValidToken(store.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};
