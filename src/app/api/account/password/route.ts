import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "../../../../lib/auth";
import { db } from "../../../../db";
import { user } from "../../../../db/schema";
export async function POST(request:NextRequest){if(!auth||!db)return NextResponse.json({error:"Autenticação não configurada"},{status:503});const session=await auth.api.getSession({headers:request.headers});if(!session?.user)return NextResponse.json({error:"Não autenticado"},{status:401});const body=await request.json();if(!body.currentPassword||!body.newPassword||body.newPassword.length<8)return NextResponse.json({error:"Informe a senha atual e uma nova senha com pelo menos 8 caracteres"},{status:400});try{await auth.api.changePassword({headers:request.headers,body:{currentPassword:body.currentPassword,newPassword:body.newPassword}});await db.update(user).set({mustChangePassword:false,updatedAt:new Date()}).where(eq(user.id,session.user.id));return NextResponse.json({ok:true})}catch{return NextResponse.json({error:"Senha atual inválida ou não foi possível alterar"},{status:400})}}
