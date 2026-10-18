import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "../../../db";
export async function GET() { if (!db) return NextResponse.json({ ok: false, database: "not-configured" }, { status: 503 }); try { await db.execute(sql`select 1`); return NextResponse.json({ ok: true, database: "connected" }); } catch { return NextResponse.json({ ok: false, database: "unavailable" }, { status: 503 }); } }
