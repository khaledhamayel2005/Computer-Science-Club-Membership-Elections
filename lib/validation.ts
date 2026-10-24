import { z } from "zod";
import { normalizeStudentId } from "./utils";

export const participantSchema = z.object({
  studentName: z.string().trim().min(3, "اسم الطالب مطلوب").max(120),
  studentId: z.string().trim().min(4, "الرقم الجامعي غير صالح").max(30)
}).transform(v => ({ ...v, normalizedStudentId: normalizeStudentId(v.studentId) }))
  .refine(v => /^[A-Za-z0-9]+$/.test(v.normalizedStudentId), { message: "الرقم الجامعي يجب أن يحتوي أحرفًا وأرقامًا فقط", path: ["studentId"] });

export const loginSchema = z.object({ username: z.string().trim().min(1), password: z.string().min(1).max(200) });
export const correctionSchema = z.object({
  action: z.enum(["correct", "void"]),
  reason: z.string().trim().min(5, "سبب التصحيح مطلوب").max(500),
  studentName: z.string().trim().min(3).max(120).optional(),
  studentId: z.string().trim().min(4).max(30).optional()
});
