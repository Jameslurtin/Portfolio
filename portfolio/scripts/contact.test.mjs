import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sendEmail } from '../src/lib/email.js';

const message = { from_name: 'Test visitor', reply_to: 'visitor@example.com', subject: 'Hello', message: 'Test message', phone: '+33 123456789' };
test('same-origin contact API handles acceptance, errors, and field mapping', async () => {
    const originalFetch = globalThis.fetch;
    try {
        let captured;
        globalThis.fetch = async (url, options) => {
            captured = { url, body: JSON.parse(options.body) };
            return { ok: true, json: async () => ({ ok: true }) };
        };
        assert.equal((await sendEmail(message)).ok, true);
        assert.equal(captured.url, '/api/contact');
        assert.equal(captured.body.reply_to, message.reply_to);
        assert.equal(captured.body.from_name, message.from_name);
        assert.equal(captured.body.subject, 'Hello');
        assert.equal(captured.body.phone, message.phone);
        let requests = 0;
        globalThis.fetch = async () => { requests++; throw new Error('Should not send'); };
        assert.equal((await sendEmail({ ...message, website: 'spam.example' })).ok, false);
        assert.equal(requests, 0, 'Honeypot submissions must not reach the network');
        globalThis.fetch = async () => ({ ok: true, json: async () => ({ ok: false }) });
        assert.equal((await sendEmail(message)).ok, false);
        globalThis.fetch = async () => ({ ok: false, json: async () => ({ ok: true }) });
        assert.equal((await sendEmail(message)).ok, false);
        globalThis.fetch = async () => ({ ok: false, json: async () => ({ ok: false, code: 'EMAIL_NOT_CONFIGURED' }) });
        assert.match((await sendEmail(message)).error, /not configured/);
        globalThis.fetch = async () => { throw new Error('network unavailable'); };
        assert.equal((await sendEmail(message)).ok, false);
        assert.equal((await sendEmail({ ...message, reply_to: 'invalid' })).ok, false);
    } finally {
        globalThis.fetch = originalFetch;
    }
});
