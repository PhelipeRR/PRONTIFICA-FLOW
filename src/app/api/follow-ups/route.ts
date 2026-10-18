import { NextRequest, NextResponse } from "next/server";
import { asc, eq, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { followUps, leads } from "../../../db/schema";
export async function GET() { if(!db)return NextResponse.json({error:"Banco não configurado"},{status:503}); return NextResponse.json(await db.select({followUp:followUps,clientName:leads.clientName}).from(followUps).innerJoin(leads,eq(followUps.leadId,leads.id)).where(isNull(followUps.completedAt)).orderBy(asc(followUps.scheduledFor))); }
export async function POST(request:NextRequest){if(!db)return NextResponse.json({error:"Banco não configurado"},{status:503});const body=await request.json();if(!body.leadId||!body.scheduledFor)return NextResponse.json({error:"leadId e scheduledFor são obrigatórios"},{status:400});const [row]=await db.insert(followUps).values({leadId:body.leadId,scheduledFor:body.scheduledFor,result:body.result??null}).returning();return NextResponse.json(row,{status:201});}
