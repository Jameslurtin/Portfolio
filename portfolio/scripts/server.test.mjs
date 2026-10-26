import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createPortfolioServer } from '../server/start.js';

test('production server serves the SPA, assets and API without exposing private files', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'portfolio-server-test-'));
  await mkdir(path.join(root, 'assets'));
  await writeFile(path.join(root, 'index.html'), '<h1>Portfolio</h1>');
  await writeFile(path.join(root, 'assets/app-123.js'), 'console.log("ready")');
  const server = createPortfolioServer({ root, contact: (_req,res) => { res.setHeader('Content-Type','application/json'); res.end('{"mock":true}'); } });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.equal((await fetch(base + '/healthz')).status, 200);
    assert.match(await (await fetch(base + '/')).text(), /Portfolio/);
    assert.match(await (await fetch(base + '/projects', { headers: { Accept: 'text/html' } })).text(), /Portfolio/);
    const asset = await fetch(base + '/assets/app-123.js');
    assert.match(asset.headers.get('Cache-Control'), /immutable/);
    assert.match(asset.headers.get('Content-Type'), /javascript/);
    for (const url of ['/.env.local','/server/contact.js','/api/unknown','/missing.js','/%2e%2e%5c.env.local']) assert.equal((await fetch(base + url)).status,404);
    assert.deepEqual(await (await fetch(base + '/api/contact', { method: 'POST' })).json(), { mock: true });
    assert.equal((await fetch(base + '/', { method:'POST' })).status,405);
    assert.equal(await (await fetch(base + '/', { method:'HEAD' })).text(), '');
  } finally { await new Promise(resolve => server.close(resolve)); await rm(root, { recursive:true, force:true }); }
});
