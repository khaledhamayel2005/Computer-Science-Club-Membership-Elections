import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { Administrator } from "@/lib/models";
import { createSession, ensureInitialAdmin } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!rateLimit(`login:${clientIp(req)}`, 8, 15 * 60_000)) return NextResponse.json({ error: "محاولات كثيرة. حاول لاحقًا." }, { status: 429 });
  try {
    const parsed = loginSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "بيانات الدخول غير صالحة" }, { status: 400 });
    await ensureInitialAdmin(); await connectDB();
    const admin = await Administrator.findOne({ username: parsed.data.username.toLowerCase(), active: true });
    if (!admin || !await bcrypt.compare(parsed.data.password, admin.passwordHash)) return NextResponse.json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" }, { status: 401 });
    await createSession({ id: admin.id, username: admin.username, displayName: admin.displayName });
    return NextResponse.json({ ok: true });
  } catch (error) { console.error(error); return NextResponse.json({ error: "تعذر تسجيل الدخول. تحقق من إعداد قاعدة البيانات." }, { status: 500 }); }
}
