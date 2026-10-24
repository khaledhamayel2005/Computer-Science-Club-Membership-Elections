import mongoose, { Schema, models, model } from "mongoose";

const administratorSchema = new Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  displayName: { type: String, default: "مدير النظام" },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const electionSchema = new Schema({
  key: { type: String, unique: true, default: "active" },
  name: { type: String, required: true }, cohort: { type: String, required: true },
  registrationOpen: { type: Boolean, default: true }
}, { timestamps: true });

const participantSchema = new Schema({
  electionId: { type: Schema.Types.ObjectId, ref: "Election", required: true, index: true },
  studentName: { type: String, required: true, trim: true },
  studentId: { type: String, required: true, trim: true },
  normalizedStudentId: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now, index: true },
  registeredBy: { type: Schema.Types.ObjectId, ref: "Administrator", required: true },
  registeredByName: { type: String, required: true },
  status: { type: String, enum: ["active", "void"], default: "active", index: true }
}, { timestamps: true });
participantSchema.index({ electionId: 1, normalizedStudentId: 1 }, { unique: true, partialFilterExpression: { status: "active" }, name: "one_active_registration_per_student" });
participantSchema.index({ electionId: 1, studentName: "text", normalizedStudentId: "text" });

const auditLogSchema = new Schema({
  electionId: { type: Schema.Types.ObjectId, ref: "Election", required: true, index: true },
  participantId: { type: Schema.Types.ObjectId, ref: "Participant", required: true },
  action: { type: String, enum: ["correct", "void", "settings", "password_change"], required: true },
  before: { type: Schema.Types.Mixed }, after: { type: Schema.Types.Mixed },
  administratorId: { type: Schema.Types.ObjectId, ref: "Administrator", required: true },
  administratorName: { type: String, required: true }, reason: { type: String, required: true }
}, { timestamps: true });

export const Administrator = models.Administrator || model("Administrator", administratorSchema);
export const Election = models.Election || model("Election", electionSchema);
export const Participant = models.Participant || model("Participant", participantSchema);
export const AuditLog = models.AuditLog || model("AuditLog", auditLogSchema);

export async function getActiveElection() {
  return Election.findOneAndUpdate({ key: "active" }, { $setOnInsert: {
    name: process.env.DEFAULT_ELECTION_NAME || "انتخابات قسم الذكاء الاصطناعي",
    cohort: process.env.DEFAULT_ELECTION_COHORT || "125", registrationOpen: true
  }}, { upsert: true, new: true });
}
