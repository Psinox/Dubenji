// =============================================
// DUBENJI — BACKEND (Cloudflare Worker)
// Reemplaza a Firebase/Firestore.
// Guarda todo en el KV namespace que le conectes (DUBENJI_KV).
// =============================================

// ⚠️ CAMBIAR esto por una clave larga inventada por vos (letras y números).
// Tiene que ser EXACTAMENTE la misma que pongas en cloud-db.js (API_SECRET).
const API_SECRET = "dbj-K7xP9mQ2vL45zRw8";

const KV_KEY = "main";

function withCors(resp) {
  resp.headers.set("Access-Control-Allow-Origin", "*");
  resp.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  resp.headers.set("Access-Control-Allow-Headers", "Content-Type, X-Api-Key");
  return resp;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return withCors(new Response(null, { status: 204 }));
    }

    // Traer todos los datos
    if (url.pathname === "/data" && request.method === "GET") {
      const raw = await env.DUBENJI_KV.get(KV_KEY);
      if (!raw) return withCors(Response.json({ exists: false }));
      return withCors(Response.json({ exists: true, data: JSON.parse(raw) }));
    }

    // Sembrar datos por primera vez (solo si no existe nada todavía)
    if (url.pathname === "/seed" && request.method === "POST") {
      const existing = await env.DUBENJI_KV.get(KV_KEY);
      if (existing) {
        return withCors(Response.json({ ok: false, reason: "ya existe", data: JSON.parse(existing) }, { status: 409 }));
      }
      const body = await request.json();
      body._v = 1;
      await env.DUBENJI_KV.put(KV_KEY, JSON.stringify(body));
      return withCors(Response.json({ ok: true, data: body }));
    }

    // Guardar un campo (productos, guiasTalles, cupones, etc.)
    if (url.pathname === "/data" && request.method === "POST") {
      const apiKey = request.headers.get("X-Api-Key");
      if (apiKey !== API_SECRET) {
        return withCors(Response.json({ ok: false, reason: "no autorizado" }, { status: 401 }));
      }
      const body = await request.json(); // { key, value, expectedVersion }
      const raw = await env.DUBENJI_KV.get(KV_KEY);
      const current = raw ? JSON.parse(raw) : {};
      const currentVersion = current._v || 0;

      if (typeof body.expectedVersion === "number" && body.expectedVersion !== currentVersion) {
        // Alguien guardó antes que vos: devolvemos el estado real para reintentar
        return withCors(Response.json({ ok: false, reason: "conflicto", data: current }, { status: 409 }));
      }

      current[body.key] = body.value;
      current._v = currentVersion + 1;
      await env.DUBENJI_KV.put(KV_KEY, JSON.stringify(current));
      return withCors(Response.json({ ok: true, version: current._v }));
    }

    return withCors(new Response("Not found", { status: 404 }));
  }
};
