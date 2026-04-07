/**
 * Vercel Serverless Function — DIIO Proxy
 *
 * Credentials live ONLY in Vercel environment variables.
 * The frontend never sees client_id / client_secret / refresh_token.
 *
 * Usage from frontend:
 *   GET  /api/diio?action=meetings
 *   GET  /api/diio?action=meeting&id=<meetingId>
 */

const DIIO_TOKEN_URL = "https://auth.diio.com/oauth/token";
const DIIO_API_BASE  = "https://api.diio.com/v1";

// ── Get a fresh access token using the stored refresh token ──────────
async function getAccessToken() {
  const res = await fetch(DIIO_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type:    "refresh_token",
      client_id:     process.env.DIIO_CLIENT_ID,
      client_secret: process.env.DIIO_CLIENT_SECRET,
      refresh_token: process.env.DIIO_REFRESH_TOKEN,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DIIO token error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.access_token;
}

// ── Main handler ─────────────────────────────────────────────────────
export default async function handler(req, res) {
  // CORS — only allow same origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { action, id, limit = "50" } = req.query;

  try {
    const token = await getAccessToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    let endpoint = "";
    switch (action) {
      case "meetings":
        // List meetings with summaries, sorted by date desc
        endpoint = `/meetings?limit=${limit}&sort=date_desc`;
        break;
      case "meeting":
        if (!id) return res.status(400).json({ error: "Missing id" });
        endpoint = `/meetings/${id}`;
        break;
      case "transcript":
        if (!id) return res.status(400).json({ error: "Missing id" });
        endpoint = `/meetings/${id}/transcript`;
        break;
      case "summary":
        if (!id) return res.status(400).json({ error: "Missing id" });
        endpoint = `/meetings/${id}/summary`;
        break;
      default:
        return res.status(400).json({ error: "Invalid action. Use: meetings | meeting | transcript | summary" });
    }

    const apiRes = await fetch(`${DIIO_API_BASE}${endpoint}`, { headers });
    const data = await apiRes.json();

    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: data });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("[DIIO proxy error]", err.message);
    return res.status(500).json({ error: err.message });
  }
}
