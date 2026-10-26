const functions = require("firebase-functions/v1");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "16kb" }));

const recentRequests = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 3;

function clean(value, maxLength) {
    return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
}

// Create the transport at request time, when the bound secret is available.
function createTransport() {
    return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER || "jameslurtin@gmail.com",
        pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    });
}

app.post(["/send", "/api/send"], async (req, res) => {
    if (!process.env.SMTP_PASS) {
        return res.status(503).json({ ok: false, error: "Email delivery is not configured yet." });
    }
    const ip = req.ip || "unknown";
    const now = Date.now();
    for (const [key, timestamps] of recentRequests) {
        if (timestamps.every((timestamp) => now - timestamp >= WINDOW_MS)) recentRequests.delete(key);
    }
    const requests = (recentRequests.get(ip) || []).filter((timestamp) => now - timestamp < WINDOW_MS);
    if (requests.length >= MAX_REQUESTS) {
        return res.status(429).json({ ok: false, error: "Too many messages. Please try again later." });
    }
    requests.push(now);
    recentRequests.set(ip, requests);

    const from_name = clean(req.body?.from_name, 100);
    const reply_to = clean(req.body?.reply_to, 254);
    const subject = clean(req.body?.subject, 160);
    const message = clean(req.body?.message, 5000);
    if (!from_name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reply_to)) {
        return res.status(400).json({ ok: false, error: "Please provide a valid name, email and message." });
    }

    const toEmail = process.env.TO_EMAIL || "jameslurtin@gmail.com";

    const mailOptions = {
        from: { name: "Portfolio contact", address: process.env.SMTP_USER || "jameslurtin@gmail.com" },
        to: toEmail,
        subject: subject || `Portfolio contact from ${from_name}`,
        text: `From: ${from_name} <${reply_to}>\n\n${message}`,
        replyTo: reply_to,
        html: `<p><strong>From:</strong> ${escapeHtml(from_name)} &lt;${escapeHtml(reply_to)}&gt;</p><p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
    };

    try {
        await createTransport().sendMail(mailOptions);
        return res.json({ ok: true });
    } catch (err) {
        console.error("Email delivery failed:", err.code || "UNKNOWN");
        return res.status(502).json({ ok: false, error: "Unable to deliver your message. Please email jameslurtin@gmail.com directly." });
    }
});

exports.api = functions.runWith({ secrets: ["SMTP_PASS"], timeoutSeconds: 60, maxInstances: 2 }).https.onRequest(app);
