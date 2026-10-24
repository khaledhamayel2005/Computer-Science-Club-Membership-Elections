import { AuditLog, getActiveElection, Participant } from "./models";
import { isDuplicateKey, normalizeStudentId } from "./utils";
import { participantSchema } from "./validation";

export class RegistrationError extends Error {
  constructor(message: string, public status: number, public participant?: unknown) { super(message); }
}

export async function registerParticipant(input: unknown, user: { id: string; displayName: string }) {
  const parsed = participantSchema.safeParse(input);
  if (!parsed.success) throw new RegistrationError(parsed.error.issues[0].message, 400);
  const election = await getActiveElection();
  if (!election.registrationOpen) throw new RegistrationError("التسجيل مغلق حاليًا", 423);
  try {
    return await Participant.create({ ...parsed.data, electionId: election._id, registeredBy: user.id, registeredByName: user.displayName, status: "active" });
  } catch (error) {
    if (!isDuplicateKey(error)) throw error;
    const participant = await Participant.findOne({ electionId: election._id, normalizedStudentId: parsed.data.normalizedStudentId, status: "active" }).lean();
    throw new RegistrationError("تنبيه! هذا الطالب مسجل مسبقًا ولا يمكنه التصويت مرة أخرى.", 409, participant);
  }
}

export async function correctParticipant(id: string, input: { action: "correct"|"void"; reason: string; studentName?: string; studentId?: string }, user: { id: string; displayName: string }) {
  const existing = await Participant.findById(id);
  if (!existing) throw new RegistrationError("السجل غير موجود", 404);
  const before = existing.toObject();
  if (input.action === "void") existing.status = "void";
  else {
    if (!input.studentName || !input.studentId) throw new RegistrationError("الاسم والرقم مطلوبان للتصحيح", 400);
    existing.studentName = input.studentName; existing.studentId = input.studentId; existing.normalizedStudentId = normalizeStudentId(input.studentId);
  }
  try { await existing.save(); } catch (error) { if (isDuplicateKey(error)) throw new RegistrationError("الرقم الجامعي مسجل لطالب آخر", 409); throw error; }
  await AuditLog.create({ electionId: existing.electionId, participantId: existing._id, action: input.action, before, after: existing.toObject(), administratorId: user.id, administratorName: user.displayName, reason: input.reason });
  return existing;
}
