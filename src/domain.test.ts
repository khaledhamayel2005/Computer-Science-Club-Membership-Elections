import { describe,expect,it } from "vitest";
import { normalizeStudentId,participantDocumentId,validateStudent } from "./domain";
describe("student identity",()=>{
 it("normalizes spaces, dashes, case and Arabic digits",()=>expect(normalizeStudentId(" ١٢٥-ab-01 ")).toBe("125AB01"));
 it("creates a deterministic document id",()=>expect(participantDocumentId("ai-125","125001")).toBe("ai-125__125001"));
 it("maps equivalent IDs to one document",()=>expect(participantDocumentId("ai-125",normalizeStudentId("125-001"))).toBe(participantDocumentId("ai-125",normalizeStudentId(" 125 001 "))));
 it("rejects invalid IDs",()=>expect(()=>validateStudent("طالب صالح","@@@")).toThrow());
 it("rejects missing names",()=>expect(()=>validateStudent("","125001")).toThrow());
});
