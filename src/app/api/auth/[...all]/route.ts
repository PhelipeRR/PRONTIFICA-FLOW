import { auth } from "../../../../lib/auth";
export const GET = (request: Request) => auth ? auth.handler(request) : new Response("Auth database unavailable", { status: 503 });
export const POST = (request: Request) => auth ? auth.handler(request) : new Response("Auth database unavailable", { status: 503 });
