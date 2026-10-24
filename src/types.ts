import type { Timestamp } from "firebase/firestore";
export type ParticipantStatus = "active" | "void" | "corrected";
export type Participant = {
  id: string; electionId: string; studentName: string; studentId: string; normalizedStudentId: string;
  registeredAt: Timestamp | null; registeredBy: string; registeredByName: string; status: ParticipantStatus;
};
export type Election = { name: string; cohort: string; registrationOpen: boolean };
export type AuditEntry = { id: string; action: string; reason: string; createdAt: Timestamp|null; administratorName: string; before?: unknown; after?: unknown };
