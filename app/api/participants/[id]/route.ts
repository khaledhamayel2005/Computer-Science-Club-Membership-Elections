import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { requireSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { correctionSchema } from "@/lib/validation";
import { apiError } from "@/lib/http";
import { correctParticipant, RegistrationError } from "@/lib/registration";
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){try{const user=await requireSession();await connectDB();const {id}=await params;if(!mongoose.isValidObjectId(id))return NextResponse.json({error:"معرّف غير صالح"},{status:400});const parsed=correctionSchema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:parsed.error.issues[0].message},{status:400});const participant=await correctParticipant(id,parsed.data,user);return NextResponse.json({ok:true,participant})}catch(e){if(e instanceof RegistrationError)return NextResponse.json({error:e.message},{status:e.status});return apiError(e)}}
