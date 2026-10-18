import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "../../../../../db";
import { followUps } from "../../../../../db/schema";
export async function PATCH(_: Request,{params}:{params:Promise<{id:string}>}){if(!db)return NextResponse.json({error:"Banco não configurado"},{status:503});const {id}=await params;const [row]=await db.update(followUps).set({completedAt:new Date()}).where(eq(followUps.id,id)).returning();return row?NextResponse.json(row):NextResponse.json({error:"Acompanhamento não encontrado"},{status:404});}
