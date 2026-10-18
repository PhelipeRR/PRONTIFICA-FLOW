import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "../../../db";
import { leadStatuses } from "../../../db/schema";
export async function GET(){if(!db)return NextResponse.json({error:"Banco não configurado"},{status:503});return NextResponse.json(await db.select().from(leadStatuses).where(leadStatuses.active).orderBy(asc(leadStatuses.sortOrder)));}
