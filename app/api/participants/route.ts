import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getActiveElection, Participant } from "@/lib/models";
import { apiError } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { registerParticipant, RegistrationError } from "@/lib/registration";

export async function GET(req: Request) { try { await requireSession(); await connectDB(); const election=await getActiveElection(); const u=new URL(req.url),q=(u.searchParams.get("q")||"").trim(),page=Math.max(1,Number(u.searchParams.get("page"))||1),limit=10; const escaped=q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"); const filter:any={electionId:election._id}; if(q)filter.$or=[{studentName:{$regex:escaped,$options:"i"}},{normalizedStudentId:{$regex:escaped,$options:"i"}}]; const start=new Date();start.setHours(0,0,0,0); const [participants,total,today]=await Promise.all([Participant.find(filter).sort({registeredAt:-1}).skip((page-1)*limit).limit(limit).lean(),Participant.countDocuments({electionId:election._id,status:"active"}),Participant.countDocuments({electionId:election._id,status:"active",registeredAt:{$gte:start}})]);return NextResponse.json({participants,total,today,pages:Math.max(1,Math.ceil((q?await Participant.countDocuments(filter):total)/limit)),election}); }catch(e){return apiError(e)} }
export async function POST(req: Request) { try { const user=await requireSession(); if(!rateLimit(`register:${user.id}`,60,60_000))return NextResponse.json({error:"طلبات كثيرة، انتظر لحظة."},{status:429}); await connectDB(); const participant=await registerParticipant(await req.json(),user);return NextResponse.json({participant},{status:201})}catch(e){if(e instanceof RegistrationError)return NextResponse.json({error:e.message,participant:e.participant},{status:e.status});return apiError(e)} }
