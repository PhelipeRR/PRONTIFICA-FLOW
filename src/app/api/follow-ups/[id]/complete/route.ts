import { NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../../../../db";
import { followUps, leads } from "../../../../../db/schema";
import { getActor, unauthorized } from "../../../../../lib/current-user";
export async function PATCH(request: Request,{params}:{params:Promise<{id:string}>}){if(!db)return NextResponse.json({error:"Banco não configurado"},{status:503});const actor=await getActor(request);if(!actor)return unauthorized();const {id}=await params;const ownedLeads=db.select({id:leads.id}).from(leads).where(eq(leads.ownerId,actor.id));const [row]=await db.update(followUps).set({completedAt:new Date()}).where(and(eq(followUps.id,id),inArray(followUps.leadId,ownedLeads))).returning();return row?NextResponse.json(row):NextResponse.json({error:"Acompanhamento não encontrado"},{status:404});}
