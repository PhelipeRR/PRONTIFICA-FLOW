import { NextRequest,NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "../../../db";
import { brokers } from "../../../db/schema";
export async function GET(){if(!db)return NextResponse.json({error:"Banco não configurado"},{status:503});return NextResponse.json(await db.select().from(brokers).orderBy(asc(brokers.name)));}
export async function POST(req:NextRequest){if(!db)return NextResponse.json({error:"Banco não configurado"},{status:503});const b=await req.json();if(!b.name)return NextResponse.json({error:"Nome obrigatório"},{status:400});const [row]=await db.insert(brokers).values({name:b.name.trim(),phone:b.phone??null,email:b.email??null,agencyId:b.agencyId??null}).returning();return NextResponse.json(row,{status:201});}
export async function PUT(req:NextRequest){if(!db)return NextResponse.json({error:"Banco não configurado"},{status:503});const b=await req.json();if(!b.id||!b.name?.trim())return NextResponse.json({error:"Nome obrigatório"},{status:400});const [row]=await db.update(brokers).set({name:b.name.trim(),phone:b.phone??null,email:b.email??null,agencyId:b.agencyId??null,active:b.active!==false}).where(eq(brokers.id,b.id)).returning();return row?NextResponse.json(row):NextResponse.json({error:"Corretor não encontrado"},{status:404});}
