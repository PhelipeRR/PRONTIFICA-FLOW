import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "../../../db";
import { leadStatuses } from "../../../db/schema";
export async function GET(){if(!db)return NextResponse.json({error:"Banco não configurado"},{status:503});return NextResponse.json(await db.select().from(leadStatuses).where(eq(leadStatuses.active,true)).orderBy(asc(leadStatuses.sortOrder)));}
export async function POST(request:Request){if(!db)return NextResponse.json({error:"Banco não configurado"},{status:503});const body=await request.json();if(!body.name?.trim())return NextResponse.json({error:"Nome do status é obrigatório"},{status:400});const [status]=await db.insert(leadStatuses).values({name:body.name.trim(),color:body.color||"#64748b",isConversion:Boolean(body.isConversion),isFinal:Boolean(body.isFinal),sortOrder:Number(body.sortOrder)||0}).returning();return NextResponse.json(status,{status:201});}
