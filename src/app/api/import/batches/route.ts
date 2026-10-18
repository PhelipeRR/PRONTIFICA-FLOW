import { NextRequest,NextResponse } from "next/server";
import { desc,eq } from "drizzle-orm";
import { db } from "../../../../db";
import { importBatches,user } from "../../../../db/schema";
import { auth } from "../../../../lib/auth";
export async function GET(request:NextRequest){if(!db||!auth)return NextResponse.json({error:"Banco não configurado"},{status:503});const session=await auth.api.getSession({headers:request.headers});if(!session?.user)return NextResponse.json({error:"Não autenticado"},{status:401});const [actor]=await db.select({role:user.role}).from(user).where(eq(user.id,session.user.id)).limit(1);if(actor?.role!=="ADMINISTRADOR")return NextResponse.json({error:"Acesso restrito"},{status:403});return NextResponse.json(await db.select().from(importBatches).orderBy(desc(importBatches.createdAt)).limit(100))}
