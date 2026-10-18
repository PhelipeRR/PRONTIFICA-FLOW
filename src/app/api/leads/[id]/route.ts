import { NextRequest,NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "../../../../db";
import { leads } from "../../../../db/schema";
export async function PUT(req:NextRequest,{params}:{params:Promise<{id:string}>}){if(!db)return NextResponse.json({error:"Banco não configurado"},{status:503});const {id}=await params;const b=await req.json();const [row]=await db.update(leads).set({clientName:b.clientName,phone:b.phone??null,contactDate:b.contactDate,notes:b.notes??null,nextContact:b.nextContact??null,updatedAt:new Date()}).where(eq(leads.id,id)).returning();return row?NextResponse.json(row):NextResponse.json({error:"Lead não encontrado"},{status:404});}
export async function DELETE(_:NextRequest,{params}:{params:Promise<{id:string}>}){if(!db)return NextResponse.json({error:"Banco não configurado"},{status:503});const {id}=await params;const [row]=await db.delete(leads).where(eq(leads.id,id)).returning({id:leads.id});return row?NextResponse.json({ok:true}):NextResponse.json({error:"Lead não encontrado"},{status:404});}
