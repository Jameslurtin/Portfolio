const CONTACT_ENDPOINT = "/api/contact";
const DELIVERY_ERROR = "Your message could not be submitted. Please try again or email jameslurtin@gmail.com directly.";
export const isContactConfigured = true;

export function sendEmailFromForm(form) {
    return sendEmail(Object.fromEntries(new FormData(form).entries()));
}

export async function sendEmail(data) {
    if (String(data.website || "").trim()) return { ok: false, error: "Unable to send. Please try again later." };
    const name = String(data.from_name || "").trim();
    const email = String(data.reply_to || "").trim();
    const message = String(data.message || "").trim();
    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { ok: false, error: "Please enter your name, a valid email address and a message." };
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
        const response = await fetch(CONTACT_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
                from_name: name.slice(0, 100), reply_to: email.slice(0, 254), message: message.slice(0, 5000),
                phone: String(data.phone || "").trim().slice(0, 50),
                subject: String(data.subject || "New contact message").replace(/[\r\n]/g, " ").slice(0, 160),
                website: String(data.website || ""),
            }),
        });
        const result = await response.json().catch(() => null);
        if (!response.ok || result?.ok !== true) {
            const messages = {
                EMAIL_NOT_CONFIGURED: "Email delivery is not configured yet. Please email jameslurtin@gmail.com directly.",
                RATE_LIMITED: "Too many messages. Please try again in 10 minutes.",
                INVALID_REQUEST: "Please check your name, email, subject and message.",
            };
            return { ok: false, error: messages[result?.code] || DELIVERY_ERROR };
        }
        return { ok: true };
    } catch {
        return { ok: false, error: DELIVERY_ERROR };
    } finally {
        clearTimeout(timeout);
    }
}

export default { sendEmailFromForm, sendEmail };
