import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { user } from "../db/schema";
import { auth } from "./auth";

export type Actor = { id: string; role: string };

/** Resolves the signed-in user. Data ownership is per account: every role only sees records it owns (imported or created). */
export async function getActor(request: Request): Promise<Actor | null> {
  if (!auth || !db) return null;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return null;
  const [row] = await db.select({ id: user.id, role: user.role }).from(user).where(eq(user.id, session.user.id)).limit(1);
  return row ?? null;
}

export const unauthorized = () => NextResponse.json({ error: "Não autenticado" }, { status: 401 });
