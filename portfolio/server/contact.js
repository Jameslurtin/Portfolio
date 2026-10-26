import nodemailer from "nodemailer";

export const RECIPIENT = "jameslurtin@gmail.com";
const LIMIT = 16 * 1024;
const WINDOW = 10 * 60 * 1000;

function reply(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  if (Number(req.headers["content-length"]) > LIMIT) throw Object.assign(new Error(), { status: 413 });
  if (req.body !== undefined) {
    if (Buffer.byteLength(typeof req.body === "string" ? req.body : JSON.stringify(req.body)) > LIMIT) throw Object.assign(new Error(), { status: 413 });
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }
  let bytes = 0;
  const chunks = [];
  for await (const chunk of req) {
    bytes += Buffer.byteLength(chunk);
    if (bytes > LIMIT) throw Object.assign(new Error(), { status: 413 });
    chunks.push(Buffer.from(chunk));
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export function createContactHandler({ getEnv = () => process.env, deliver, fetchEmail = globalThis.fetch, now = Date.now } = {}) {
  // Per-instance protection. Configure a hosting firewall rate limit for distributed traffic.
  const recent = new Map();
  return async function contact(req, res) {
    if (req.method !== "POST") { res.setHeader("Allow", "POST"); return reply(res, 405, { ok: false, code: "METHOD_NOT_ALLOWED" }); }
    if (req.headers["sec-fetch-site"] === "cross-site") return reply(res, 403, { ok: false, code: "FORBIDDEN" });
    if (!/^application\/json(?:;|$)/i.test(req.headers["content-type"] || "")) return reply(res, 415, { ok: false, code: "JSON_REQUIRED" });
    const env = getEnv();
    const ip = env.VERCEL ? String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim() : req.socket?.remoteAddress || "local";
    const timestamp = now();
    for (const [key, entry] of recent) if (timestamp - entry.start >= WINDOW) recent.delete(key);
    const entry = recent.get(ip) || { start: timestamp, count: 0 };
    if (entry.count >= 5 || (!recent.has(ip) && recent.size >= 5000)) {
      res.setHeader("Retry-After", "600");
      return reply(res, 429, { ok: false, code: "RATE_LIMITED" });
    }
    entry.count++; recent.set(ip, entry);
    let body;
    try { body = await readBody(req); }
    catch (error) { return reply(res, error.status || 400, { ok: false, code: "INVALID_REQUEST" }); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return reply(res, 400, { ok: false, code: "INVALID_REQUEST" });
    const fields = {};
    for (const [key, max] of Object.entries({ from_name: 100, reply_to: 254, subject: 160, phone: 50, message: 5000, website: 200 })) {
      if (body[key] !== undefined && typeof body[key] !== "string") return reply(res, 400, { ok: false, code: "INVALID_REQUEST" });
      fields[key] = (body[key] || "").trim();
      if (fields[key].length > max) return reply(res, 400, { ok: false, code: "INVALID_REQUEST" });
    }
    if (fields.website || !fields.from_name || !fields.subject || !fields.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.reply_to) || /[\r\n]/.test(fields.subject + fields.from_name + fields.phone)) {
      return reply(res, 400, { ok: false, code: "INVALID_REQUEST" });
    }
    const provider = env.EMAIL_PROVIDER || "smtp";
    if (!["smtp", "resend"].includes(provider) || !(provider === "resend" ? env.RESEND_API_KEY?.trim() : env.SMTP_PASS?.trim())) return reply(res, 503, { ok: false, code: "EMAIL_NOT_CONFIGURED" });
    const mail = {
      from: { name: "Jameslurtin Portfolio", address: env.SMTP_USER || RECIPIENT },
      to: RECIPIENT,
      replyTo: fields.reply_to,
      subject: `Portfolio: ${fields.subject}`,
      text: `Name: ${fields.from_name}\nEmail: ${fields.reply_to}\nPhone: ${fields.phone || "Not provided"}\nSubject: ${fields.subject}\n\n${fields.message}`,
    };
    let transport;
    try {
      if (provider === "resend") {
        const response = await fetchEmail("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${env.RESEND_API_KEY.trim()}`, "Content-Type": "application/json" },
          signal: AbortSignal.timeout(15000),
          body: JSON.stringify({ from: env.EMAIL_FROM || "Jameslurtin Portfolio <onboarding@resend.dev>", to: [RECIPIENT], reply_to: mail.replyTo, subject: mail.subject, text: mail.text }),
        });
        if (!response.ok || !(await response.json()).id) throw new Error("Email not accepted");
        return reply(res, 200, { ok: true });
      }
      if (!deliver) transport = nodemailer.createTransport({
        host: env.SMTP_HOST || "smtp.gmail.com",
        port: Number(env.SMTP_PORT || 465),
        secure: Number(env.SMTP_PORT || 465) === 465,
        requireTLS: true,
        auth: { user: env.SMTP_USER || RECIPIENT, pass: env.SMTP_PASS.replace(/\s/g, "") },
        connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
      });
      const result = await (deliver ? deliver(mail) : transport.sendMail(mail));
      if (!result.accepted?.some(address => String(address).toLowerCase() === RECIPIENT)) throw new Error("Recipient not accepted");
      return reply(res, 200, { ok: true });
    } catch {
      return reply(res, 502, { ok: false, code: "DELIVERY_FAILED" });
    } finally { transport?.close(); }
  };
}
