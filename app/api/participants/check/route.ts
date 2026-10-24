import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getActiveElection, Participant } from "@/lib/models";
import { normalizeStudentId } from "@/lib/utils";
import { apiError } from "@/lib/http";
export async function GET(req: Request) { try { await requireSession(); await connectDB(); const id=normalizeStudentId(new URL(req.url).searchParams.get("studentId")||""); if(!id) return NextResponse.json({error:"الرقم الجامعي مطلوب"},{status:400}); const election=await getActiveElection(); const p=await Participant.findOne({electionId:election._id,normalizedStudentId:id,status:"active"}).lean(); return NextResponse.json(p?{available:false,error:"تنبيه! هذا الطالب مسجل مسبقًا ولا يمكنه التصويت مرة أخرى.",participant:p}:{available:true}); } catch(e){return apiError(e)} }
