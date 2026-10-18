import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "../../../../lib/auth";
import { db } from "../../../../db";
import { user } from "../../../../db/schema";
export async function GET(request:NextRequest){if(!auth||!db)return NextResponse.json({error:"Autenticação não configurada"},{status:503});const session=await auth.api.getSession({headers:request.headers});if(!session?.user)return NextResponse.json({error:"Não autenticado"},{status:401});const [row]=await db.select({id:user.id,name:user.name,email:user.email,role:user.role,mustChangePassword:user.mustChangePassword}).from(user).where(eq(user.id,session.user.id)).limit(1);return NextResponse.json(row||session.user)}
