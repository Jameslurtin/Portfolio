import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { createContactHandler, RECIPIENT } from '../server/contact.js';

const valid = { from_name: 'Test Visitor', reply_to: 'visitor@example.com', phone: '+33 123456789', subject: 'Internship', message: 'Hello <b>James</b>' };
function setup(options = {}) {
  const sent = [];
  const handler = createContactHandler({ getEnv: () => ({ SMTP_PASS: 'test-only' }), deliver: async mail => { sent.push(mail); return { accepted: [RECIPIENT] }; }, ...options });
  return { sent, async request(body = valid, options = {}) {
    const req = Readable.from([typeof body === 'string' ? body : JSON.stringify(body)]);
    Object.assign(req, { method: 'POST', headers: { 'content-type': 'application/json' }, socket: { remoteAddress: '127.0.0.1' }, ...options });
    const res = { headers: {}, setHeader(key, value) { this.headers[key] = value; }, end(body) { this.body = JSON.parse(body); } };
    await handler(req, res);
    return res;
  } };
}
test('delivers to the fixed owner, preserves phone and reply-to, ignores recipient injection', async () => {
  const service = setup();
  assert.equal((await service.request({ ...valid, to: 'attacker@example.com', cc: 'attacker@example.com' })).statusCode, 200);
  assert.equal(service.sent[0].to, 'jameslurtin@gmail.com');
  assert.equal(service.sent[0].replyTo, valid.reply_to);
  assert.match(service.sent[0].text, /\+33 123456789/);
  assert.equal(service.sent[0].cc, undefined);
  assert.equal(service.sent[0].html, undefined);
});
test('rejects invalid input, header injection and honeypot without delivering', async () => {
  for (const body of [{ ...valid, website: 'spam' }, { ...valid, reply_to: 'bad' }, { ...valid, subject: 'hello\nBcc: bad@example.com' }, { ...valid, message: '' }, { ...valid, phone: {} }, { ...valid, subject: '' }]) {
    const service = setup();
    assert.equal((await service.request(body)).statusCode, 400);
    assert.equal(service.sent.length, 0);
  }
});
test('rejects oversized or malformed bodies and incorrect methods or content types', async () => {
  assert.equal((await setup().request('x'.repeat(17000))).statusCode, 413);
  assert.equal((await setup().request('{bad json')).statusCode, 400);
  assert.equal((await setup().request(valid, { method: 'GET' })).statusCode, 405);
  assert.equal((await setup().request(valid, { headers: { 'content-type': 'text/plain' } })).statusCode, 415);
  assert.equal((await setup().request(valid, { headers: { 'content-type': 'application/json', 'sec-fetch-site': 'cross-site' } })).statusCode, 403);
});
test('missing credentials and SMTP failure cannot report success or expose secrets', async () => {
  assert.equal((await setup({ getEnv: () => ({}) }).request()).body.code, 'EMAIL_NOT_CONFIGURED');
  const failed = await setup({ deliver: async () => { throw new Error('secret SMTP diagnostic'); } }).request();
  assert.equal(failed.statusCode, 502);
  assert.equal(JSON.stringify(failed.body).includes('secret'), false);
  assert.equal((await setup({ deliver: async () => ({ accepted: [], rejected: [RECIPIENT] }) }).request()).statusCode, 502);
});
test('rate limits repeated sends and allows sends after the window expires', async () => {
  let clock = 0;
  const service = setup({ now: () => clock });
  for (let i = 0; i < 5; i++) assert.equal((await service.request()).statusCode, 200);
  assert.equal((await service.request()).statusCode, 429);
  assert.equal(service.sent.length, 5);
  clock = 600001;
  assert.equal((await service.request()).statusCode, 200);
});
test('accepts the parsed request body supplied by Vercel', async () => {
  assert.equal((await setup().request('', { body: valid })).statusCode, 200);
});

test('Resend uses HTTPS, the fixed recipient and visitor reply-to', async () => {
  let captured;
  const service = setup({
    getEnv: () => ({ EMAIL_PROVIDER: 'resend', RESEND_API_KEY: 'test-key' }),
    fetchEmail: async (url, options) => {
      captured = { url, ...options, body: JSON.parse(options.body) };
      return { ok: true, json: async () => ({ id: 'email-id' }) };
    },
  });
  assert.equal((await service.request({ ...valid, to: 'attacker@example.com' })).statusCode, 200);
  assert.equal(captured.url, 'https://api.resend.com/emails');
  assert.equal(captured.headers.Authorization, 'Bearer test-key');
  assert.deepEqual(captured.body.to, [RECIPIENT]);
  assert.equal(captured.body.reply_to, valid.reply_to);
  assert.match(captured.body.from, /onboarding@resend.dev/);
  assert.equal(service.sent.length, 0, 'Must not use SMTP on Render free');
});

test('Resend missing keys, rejected sends, malformed responses and timeouts fail safely', async () => {
  assert.equal((await setup({ getEnv: () => ({ EMAIL_PROVIDER: 'resend', SMTP_PASS: 'unused' }) }).request()).statusCode, 503);
  for (const fetchEmail of [
    async () => ({ ok: false }),
    async () => ({ ok: true, json: async () => ({}) }),
    async () => { throw new Error('secret provider diagnostic'); },
  ]) {
    const result = await setup({ getEnv: () => ({ EMAIL_PROVIDER: 'resend', RESEND_API_KEY: 'secret' }), fetchEmail }).request();
    assert.equal(result.statusCode, 502);
    assert.deepEqual(result.body, { ok: false, code: 'DELIVERY_FAILED' });
  }
});
