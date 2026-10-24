import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { AuditLog, Election, Participant } from "@/lib/models";
import { correctParticipant, registerParticipant, RegistrationError } from "@/lib/registration";
import { participantSchema } from "@/lib/validation";
import { middleware } from "@/middleware";
import { NextRequest } from "next/server";

let mongo: MongoMemoryReplSet;
const admin = { id: new mongoose.Types.ObjectId().toString(), displayName: "منظم الاختبار" };
beforeAll(async()=>{ mongo=await MongoMemoryReplSet.create({replSet:{count:1}}); await mongoose.connect(mongo.getUri()); await Participant.syncIndexes(); });
afterAll(async()=>{ await mongoose.disconnect(); await mongo.stop(); });
beforeEach(async()=>{ await Promise.all([Participant.deleteMany({}),Election.deleteMany({}),AuditLog.deleteMany({})]); });

describe("CAC registration rules",()=>{
  it("registers a first participant and persists it",async()=>{const p=await registerParticipant({studentName:"خالد أحمد",studentId:" 125-001 "},admin);expect(p.normalizedStudentId).toBe("125001");expect(await Participant.countDocuments()).toBe(1);expect((await Participant.findById(p._id))?.studentName).toBe("خالد أحمد")});
  it("rejects a duplicate ID with HTTP-equivalent 409",async()=>{await registerParticipant({studentName:"طالب أول",studentId:"125001"},admin);await expect(registerParticipant({studentName:"طالب ثان",studentId:"125-001"},admin)).rejects.toMatchObject({status:409})});
  it("allows exactly one of two simultaneous submissions",async()=>{const results=await Promise.allSettled([registerParticipant({studentName:"طالب واحد",studentId:"125009"},admin),registerParticipant({studentName:"طالب اثنان",studentId:"125009"},admin)]);expect(results.filter(r=>r.status==="fulfilled")).toHaveLength(1);expect(results.filter(r=>r.status==="rejected"&&(r.reason as RegistrationError).status===409)).toHaveLength(1)});
  it("rejects invalid IDs",()=>{expect(participantSchema.safeParse({studentName:"طالب صالح",studentId:"@@@"}).success).toBe(false)});
  it("rejects a missing name",()=>{expect(participantSchema.safeParse({studentName:"",studentId:"125001"}).success).toBe(false)});
  it("rejects registration when the election is closed",async()=>{await Election.create({key:"active",name:"اختبار",cohort:"125",registrationOpen:false});await expect(registerParticipant({studentName:"طالب صالح",studentId:"125001"},admin)).rejects.toMatchObject({status:423})});
  it("returns correct active participant counts",async()=>{const a=await registerParticipant({studentName:"طالب أول",studentId:"1A23"},admin);await registerParticipant({studentName:"طالب ثان",studentId:"1A24"},admin);await correctParticipant(a.id,{action:"void",reason:"إدخال تجريبي خاطئ"},admin);expect(await Participant.countDocuments({status:"active"})).toBe(1)});
  it("preserves correction and void history in the audit log",async()=>{const p=await registerParticipant({studentName:"اسم قديم",studentId:"125111"},admin);await correctParticipant(p.id,{action:"correct",studentName:"اسم مصحح",studentId:"125112",reason:"تصحيح الرقم المدخل"},admin);const log=await AuditLog.findOne({participantId:p._id});expect(log?.before.studentId).toBe("125111");expect(log?.after.studentId).toBe("125112");expect(log?.reason).toBe("تصحيح الرقم المدخل")});
  it("blocks unauthorized protected requests",()=>{const response=middleware(new NextRequest("https://example.test/api/participants"));expect(response.status).toBe(401)});
});
