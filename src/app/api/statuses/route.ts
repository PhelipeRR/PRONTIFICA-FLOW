import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "../../../db";
import { leadStatuses } from "../../../db/schema";
export async function GET(){if(!db)return NextResponse.json({error:"Banco não configurado"},{status:503});return NextResponse.json(await db.select().from(leadStatuses).where(eq(leadStatuses.active,true)).orderBy(asc(leadStatuses.sortOrder)));}
