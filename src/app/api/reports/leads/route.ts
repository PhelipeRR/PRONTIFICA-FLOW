import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getActor, unauthorized } from "../../../../lib/current-user";
import { db } from "../../../../db";
import { leads, leadStatuses } from "../../../../db/schema";
export async function GET(request:Request){if(!db)return NextResponse.json({error:"Banco não configurado"},{status:503});const actor=await getActor(request);if(!actor)return unauthorized();const rows=await db.select({name:leads.clientName,phone:leads.phone,date:leads.contactDate,status:leadStatuses.name}).from(leads).leftJoin(leadStatuses,eq(leads.statusId,leadStatuses.id)).where(eq(leads.ownerId,actor.id));const csv=["Cliente;Telefone;Data;Status",...rows.map(r=>[r.name,r.phone??"",r.date,r.status??""].map(v=>`"${String(v).replaceAll('"','""')}"`).join(";"))].join("\n");return new NextResponse("\uFEFF"+csv,{headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":"attachment; filename=leads.csv"}});}
