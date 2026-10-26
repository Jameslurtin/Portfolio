const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

function loadHandler({ password = "test-only", fail = false } = {}) {
    let handler;
    let routes;
    let sent;
    let options;
    const app = { use() {}, post(paths, callback) { routes = paths; handler = callback; } };
    const express = Object.assign(() => app, { json: () => () => {} });
    const modules = {
        express,
        cors: () => () => {},
        "firebase-functions/v1": { runWith(value) { options = value; return { https: { onRequest: () => app } }; } },
        nodemailer: { createTransport: () => ({ sendMail: async (mail) => {
            if (fail) throw Object.assign(new Error("private SMTP diagnostic"), { code: "EAUTH" });
            sent = mail;
        } }) },
    };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, "index.js"), "utf8"), {
        require: (name) => modules[name], exports: {}, process: { env: { SMTP_PASS: password } },
        console: { error() {} },
    });
    return { routes, options, getSent: () => sent, async request(body, ip = "test-client") {
        const response = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(data) { this.body = data; return this; } };
        await handler({ body, ip }, response);
        return response;
    } };
}

const message = { from_name: "Visitor <b>", reply_to: "visitor@example.com", subject: "Internship", message: "Hello <script>alert(1)</script>" };

test("accepts both URL forms, binds secret, and delivers only to the owner", async () => {
    const service = loadHandler();
    assert.ok(service.routes.includes("/send") && service.routes.includes("/api/send"));
    assert.ok(service.options.secrets.includes("SMTP_PASS"));
    assert.equal((await service.request(message)).body.ok, true);
    const mail = service.getSent();
    assert.equal(mail.to, "jameslurtin@gmail.com");
    assert.equal(mail.from.address, "jameslurtin@gmail.com");
    assert.equal(mail.replyTo, "visitor@example.com");
    assert.ok(!mail.html.includes("<script>"));
    assert.ok(mail.html.includes("&lt;script&gt;"));
});

test("rejects missing configuration and invalid email without sending", async () => {
    assert.equal((await loadHandler({ password: "" }).request(message)).statusCode, 503);
    const service = loadHandler();
    assert.equal((await service.request({ ...message, reply_to: "invalid" })).statusCode, 400);
    assert.equal(service.getSent(), undefined);
});

test("limits repeated requests from one client", async () => {
    const service = loadHandler();
    for (let i = 0; i < 3; i++) assert.equal((await service.request(message)).statusCode, 200);
    assert.equal((await service.request(message)).statusCode, 429);
    assert.equal((await service.request(message, "other-client")).statusCode, 200);
});

test("does not report success or expose SMTP diagnostics on delivery failure", async () => {
    const result = await loadHandler({ fail: true }).request(message);
    assert.equal(result.statusCode, 502);
    assert.equal(result.body.ok, false);
    assert.ok(!result.body.error.includes("private SMTP"));
});
