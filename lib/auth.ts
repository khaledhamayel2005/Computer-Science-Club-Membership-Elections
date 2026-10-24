import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { connectDB } from "./db";
import { Administrator } from "./models";

const COOKIE = "cac_session";
const secret = () => {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters");
  return new TextEncoder().encode(value);
};

export type SessionUser = { id: string; username: string; displayName: string };
export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("12h").sign(secret());
  (await cookies()).set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 60 * 60 * 12 });
}
export async function getSession(): Promise<SessionUser | null> {
  try {
    const token = (await cookies()).get(COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret());
    return { id: String(payload.id), username: String(payload.username), displayName: String(payload.displayName) };
  } catch { return null; }
}
export async function requireSession() {
  const user = await getSession();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}
export async function clearSession() { (await cookies()).delete(COOKIE); }
export async function ensureInitialAdmin() {
  await connectDB();
  const username = process.env.ADMIN_INITIAL_USERNAME?.trim().toLowerCase();
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!username || !password) return;
  if (!await Administrator.exists({})) {
    await Administrator.create({ username, passwordHash: await bcrypt.hash(password, 12), displayName: "أيهم" });
  }
}
