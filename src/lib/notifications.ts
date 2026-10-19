import { eq } from "drizzle-orm";
import { db } from "../db";
import { operationalSettings, user } from "../db/schema";

export async function sendUserNotification(userId: string, subject: string, html: string) {
  if (!db) return { sent: false, reason: "database_unavailable" };
  const [recipient] = await db.select({ email: user.email, name: user.name }).from(user).where(eq(user.id, userId)).limit(1);
  if (!recipient?.email) return { sent: false, reason: "user_email_missing" };
  const settings = Object.fromEntries((await db.select().from(operationalSettings)).map(item => [item.key, item.value]));
  if (settings.notifications_enabled !== "true" || !settings.resend_api_key || !settings.notification_from) return { sent: false, reason: "notifications_not_configured" };
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${settings.resend_api_key}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: `${settings.notification_from_name || "Prontifica Flow"} <${settings.notification_from}>`, to: [recipient.email], reply_to: settings.notification_reply_to || undefined, subject, html }) });
  return { sent: response.ok, reason: response.ok ? undefined : "resend_rejected", email: recipient.email };
}
