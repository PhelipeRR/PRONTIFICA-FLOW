import { NextRequest,NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "../../../db";
import { brokers } from "../../../db/schema";
export async function GET(){if(!db)return NextResponse.json({error:"Banco não configurado"},{status:503});return NextResponse.json(await db.select().from(brokers).orderBy(asc(brokers.name)));}
export async function POST(req:NextRequest){if(!db)return NextResponse.json({error:"Banco não configurado"},{status:503});const b=await req.json();if(!b.name)return NextResponse.json({error:"Nome obrigatório"},{status:400});const [row]=await db.insert(brokers).values({name:b.name.trim(),phone:b.phone??null,email:b.email??null,agencyId:b.agencyId??null}).returning();return NextResponse.json(row,{status:201});}
