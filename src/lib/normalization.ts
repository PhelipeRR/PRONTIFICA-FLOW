export function normalizeText(value: unknown) { return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : ""; }
export function normalizePhone(value: unknown) { const digits = normalizeText(value).replace(/\D/g, ""); return digits || null; }
export function normalizePerson(value: unknown, fallback: string) { const text = normalizeText(value); return text ? text.toLocaleUpperCase("pt-BR") : fallback; }
