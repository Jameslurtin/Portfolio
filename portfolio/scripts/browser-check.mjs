import { spawn } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';

const profileDir = await mkdtemp(path.join(tmpdir(), 'portfolio-browser-'));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=0', `--user-data-dir=${profileDir}`, 'about:blank',
], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
let socket;
try {
  const endpoint = await new Promise((resolve, reject) => {
    let output = '';
    const timeout = setTimeout(() => reject(new Error('Chrome startup timeout')), 15000);
    chrome.on('error', reject);
    chrome.stderr.on('data', chunk => {
      output += chunk;
      const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) { clearTimeout(timeout); resolve(match[1]); }
    });
  });
  const browserUrl = new URL(endpoint);
  const pages = await fetch(`http://${browserUrl.host}/json/list`).then(response => response.json());
  socket = new WebSocket(pages.find(page => page.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let sequence = 0;
  const pending = new Map();
  const errors = [];
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
    const request = pending.get(message.id);
    if (request) { pending.delete(message.id); clearTimeout(request.timeout); message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result); }
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`Timed out: ${method}`)); }, 15000);
    pending.set(id, { resolve, reject, timeout });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const response = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.text + ': ' + response.result?.description);
    return response.result.value;
  };
  const waitFor = expression => evaluate(`new Promise((resolve,reject) => { const started = Date.now(); const poll = () => { if (${expression}) resolve(true); else if(Date.now()-started>10000) reject(new Error('Condition timed out')); else setTimeout(poll,50); }; poll(); })`);
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://127.0.0.1:5174/?lang=en' });
  await waitFor('document.querySelector("h1") && document.querySelector("#site-navigation")');
  assert.equal(await evaluate('document.documentElement.lang'), 'en');
  assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, 'Desktop overflow');
  assert.equal(await evaluate('document.querySelectorAll(".project-folder-card").length'), 5);
  await evaluate('document.querySelector("#projects").scrollIntoView({behavior:"instant"})');
  await waitFor('document.querySelector("#projects article").classList.contains("is-visible")');
  await evaluate('new Promise(resolve => setTimeout(resolve,800))');
  const desktopProjects = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile('browser-projects-desktop.local.png', Buffer.from(desktopProjects.data, 'base64'));
  await evaluate('document.querySelector(".project-folder-toggle").focus()');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await waitFor('document.querySelector(".project-folder-toggle").getAttribute("aria-expanded") === "true"');
  await waitFor('document.querySelector("dialog[open]")');
  assert.ok(await evaluate('document.querySelector(".project-modal").textContent.includes("retrieval-augmented")'));
  assert.equal(await evaluate('document.body.style.overflow'), 'hidden');
  assert.equal(await evaluate('document.activeElement.classList.contains("project-modal-close")'), true);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, modifiers: 8 });
  assert.equal(await evaluate('Boolean(document.activeElement.closest(".project-modal"))'), true);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await waitFor('!document.querySelector("dialog[open]")');
  assert.equal(await evaluate('document.activeElement.classList.contains("project-folder-toggle")'), true);
  assert.equal(await evaluate('document.body.style.overflow'), '');
  for (let index = 0; index < 5; index++) {
    await evaluate(`document.querySelectorAll('.folder-card-content h3')[${index}].click()`);
    await waitFor('document.querySelector("dialog[open]")');
    assert.equal(await evaluate('document.querySelector(".project-modal h2").textContent'), await evaluate(`document.querySelectorAll('.folder-card-content h3')[${index}].textContent`));
    await evaluate('document.querySelector(".project-modal-close").click()');
    await waitFor('!document.querySelector("dialog")');
  }
  await evaluate('document.querySelector(".project-folder-toggle").click()');
  await waitFor('document.querySelector("dialog[open]")');
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 3, y: 3, button: 'left', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 3, y: 3, button: 'left', clickCount: 1 });
  await waitFor('!document.querySelector("dialog")');
  assert.equal(await evaluate('document.querySelectorAll(".folder-project-links a[href^=https]").length'), 4);
  await waitFor('document.querySelector(".hero-role > span[aria-hidden=true]:last-child").textContent.length > 5');
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 300, y: 200 });
  await waitFor('document.documentElement.classList.contains("custom-cursor")');
  await evaluate('document.querySelector("nav a[hreflang=fr]").click()');
  await waitFor('document.documentElement.lang === "fr"');
  assert.equal(await evaluate('document.querySelector("#about h2").textContent'), 'Une IA concrète. Des logiciels utiles.');
  assert.equal(await evaluate('document.querySelector("#projects h3").textContent'), 'Assistant documentaire RAG');
  assert.equal(await evaluate('localStorage.getItem("portfolio-language")'), 'fr');
  await send('Page.reload');
  await new Promise(resolve => setTimeout(resolve, 500));
  await waitFor('document.querySelector("nav a[hreflang=en]") && document.documentElement.lang === "fr"');
  await evaluate('document.querySelector("nav a[hreflang=en]").click()');
  await waitFor('document.documentElement.lang === "en"');
  await evaluate('history.back()');
  await waitFor('document.documentElement.lang === "fr"');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true });
  await evaluate('document.querySelector(".menu-toggle").focus(); document.querySelector(".menu-toggle").click()');
  await waitFor('document.querySelector(".menu-toggle").getAttribute("aria-expanded") === "true"');
  await evaluate('document.querySelector("#site-navigation a[href=\\"#projects\\"]").click()');
  await waitFor('document.querySelector(".menu-toggle").getAttribute("aria-expanded") === "false"');
  await waitFor('document.querySelector("#site-navigation a[href=\\"#projects\\"]").getAttribute("aria-current") === "location"');
  assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, 'Mobile overflow');
  await waitFor('document.querySelector("#projects article").classList.contains("is-visible")');
  await evaluate('document.querySelector(".project-folder-toggle").click()');
  await waitFor('document.querySelector(".project-folder-toggle").getAttribute("aria-expanded") === "true"');
  assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, 'Open mobile folder overflow');
  assert.ok(await evaluate('document.querySelector(".project-modal").textContent.includes("Développement")'));
  assert.equal(await evaluate('document.querySelector(".project-modal").scrollWidth <= document.querySelector(".project-modal").clientWidth'), true);
  await evaluate('new Promise(resolve => setTimeout(resolve,700))');
  const mobileProjects = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile('browser-projects-mobile.local.png', Buffer.from(mobileProjects.data, 'base64'));
  await evaluate('document.querySelector(".project-modal-close").click()');
  await waitFor('!document.querySelector("dialog")');
  await evaluate('document.querySelector(".menu-toggle").focus(); document.querySelector(".menu-toggle").click()');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await waitFor('document.querySelector(".menu-toggle").getAttribute("aria-expanded") === "false"');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await waitFor('!document.documentElement.classList.contains("custom-cursor")');
  await evaluate(`document.querySelector('#contact').scrollIntoView(); window.requests = []; window.fetch = async (url, options) => { window.requests.push(JSON.parse(options.body)); await new Promise(resolve => setTimeout(resolve,250)); return { ok:true, json: async () => ({ok:true}) }; };`);
  await evaluate(`document.querySelector('form').requestSubmit()`);
  assert.equal(await evaluate('window.requests.length'), 0, 'Invalid forms must not send');
  const fill = `const form = document.querySelector('form'); form.elements.from_name.value='Browser Test'; form.elements.reply_to.value='test@example.com'; form.elements.subject.value='Mock only'; form.elements.phone.value='+33 123456789'; form.elements.message.value='No real delivery';`;
  await evaluate(`{ ${fill} form.elements.website.value='spam'; form.requestSubmit(); }`);
  assert.equal(await evaluate('window.requests.length'), 0, 'Honeypot must not send');
  await evaluate(`{ ${fill} form.elements.website.value=''; form.requestSubmit(); }`);
  await waitFor('document.querySelector("button[type=submit]").disabled');
  await waitFor('document.querySelector(".form-success")');
  assert.equal(await evaluate('window.requests[0].phone'), '+33 123456789');
  assert.equal(await evaluate('document.querySelector("form").elements.from_name.value'), '');
  await evaluate(`window.fetch = async () => ({ok:false, json:async()=>({ok:false})}); { ${fill} form.requestSubmit(); }`);
  await waitFor('document.querySelector(".form-error") && !document.querySelector("button[type=submit]").disabled');
  assert.equal(await evaluate('document.querySelector("form").elements.message.value'), 'No real delivery');
  assert.deepEqual(errors, [], 'Browser runtime errors');
  await evaluate('document.querySelector("#home").scrollIntoView()');
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile('browser-mobile.local.png', Buffer.from(screenshot.data, 'base64'));
  console.log('PASS: desktop/mobile overflow, cursor, typewriter, EN/FR and history, mobile menu/Escape, active navigation, reveals, reduced motion, form validation, honeypot, pending/success/failure, phone field, no runtime errors.');
} finally {
  socket?.close();
  chrome.kill();
}
