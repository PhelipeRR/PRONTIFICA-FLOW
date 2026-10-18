import { NextRequest,NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "../../../db";
import { agencies } from "../../../db/schema";
export async function GET(){if(!db)return NextResponse.json({error:"Banco não configurado"},{status:503});return NextResponse.json(await db.select().from(agencies).orderBy(asc(agencies.name)));}
export async function POST(req:NextRequest){if(!db)return NextResponse.json({error:"Banco não configurado"},{status:503});const b=await req.json();if(!b.name)return NextResponse.json({error:"Nome obrigatório"},{status:400});const [row]=await db.insert(agencies).values({name:b.name.trim(),cnpj:b.cnpj??null,phone:b.phone??null,email:b.email??null}).returning();return NextResponse.json(row,{status:201});}
export async function PUT(req:NextRequest){if(!db)return NextResponse.json({error:"Banco não configurado"},{status:503});const b=await req.json();if(!b.id||!b.name?.trim())return NextResponse.json({error:"Nome obrigatório"},{status:400});const [row]=await db.update(agencies).set({name:b.name.trim(),cnpj:b.cnpj??null,phone:b.phone??null,email:b.email??null,active:b.active!==false}).where(eq(agencies.id,b.id)).returning();return row?NextResponse.json(row):NextResponse.json({error:"Imobiliária não encontrada"},{status:404});}
