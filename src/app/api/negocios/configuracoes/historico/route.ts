import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { auth } from "../../../../../lib/auth";
import { db } from "../../../../../db";
import { auditLogs, user } from "../../../../../db/schema";
export async function GET(request:NextRequest){if(!db||!auth)return NextResponse.json({error:"Banco não configurado"},{status:503});const session=await auth.api.getSession({headers:request.headers});if(!session?.user)return NextResponse.json({error:"Não autenticado"},{status:401});const [actor]=await db.select({role:user.role}).from(user).where(eq(user.id,session.user.id)).limit(1);if(actor?.role!=="ADMINISTRADOR")return NextResponse.json({error:"Acesso restrito"},{status:403});const rows=await db.select({id:auditLogs.id,event:auditLogs.event,module:auditLogs.module,resourceId:auditLogs.resourceId,summary:auditLogs.summary,createdAt:auditLogs.createdAt,userName:user.name,userEmail:user.email}).from(auditLogs).leftJoin(user,eq(auditLogs.userId,user.id)).where(eq(auditLogs.module,"NEGOCIOS_CONFIGURACOES")).orderBy(desc(auditLogs.createdAt)).limit(200);return NextResponse.json(rows)}
