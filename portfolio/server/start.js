import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createContactHandler } from "./contact.js";

const defaultRoot = fileURLToPath(new URL("../dist/", import.meta.url));
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon", ".pdf": "application/pdf", ".woff2": "font/woff2" };

export function createPortfolioServer({ root = defaultRoot, contact = createContactHandler() } = {}) {
  const publicRoot = path.resolve(root);
  return createServer(async (req, res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-Frame-Options", "DENY");
    try {
      const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
      if (pathname === "/api/contact") return await contact(req, res);
      if (pathname === "/healthz" && ["GET", "HEAD"].includes(req.method)) {
        res.setHeader("Content-Type", "application/json"); res.setHeader("Cache-Control", "no-store");
        res.end(req.method === "HEAD" ? undefined : '{"ok":true}'); return;
      }
      if (pathname.startsWith("/api/") || pathname.split(/[\\/]/).some(part => part.startsWith(".")) || pathname.includes("\0")) { res.writeHead(404); res.end(); return; }
      if (!["GET", "HEAD"].includes(req.method)) { res.writeHead(405, { Allow: "GET, HEAD" }); res.end(); return; }
      let file = path.resolve(publicRoot, `.${pathname}`);
      if (file !== publicRoot && !file.startsWith(publicRoot + path.sep)) { res.writeHead(404); res.end(); return; }
      let info = await stat(file).catch(() => null);
      if (!info?.isFile() && !path.extname(pathname) && /text\/html|\*\/\*/.test(req.headers.accept || "")) {
        file = path.join(publicRoot, "index.html"); info = await stat(file).catch(() => null);
      }
      if (!info?.isFile()) { res.writeHead(404); res.end(); return; }
      res.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream");
      res.setHeader("Content-Length", info.size);
      res.setHeader("Cache-Control", pathname.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "no-cache");
      if (req.method === "HEAD") { res.end(); return; }
      const stream = createReadStream(file);
      stream.on("error", () => res.destroy());
      stream.pipe(res);
    } catch { if (!res.headersSent) res.writeHead(400); res.end(); }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const server = createPortfolioServer();
  server.requestTimeout = 30000;
  server.headersTimeout = 15000;
  server.listen(Number(process.env.PORT || 8080), "0.0.0.0", () => console.log(`Portfolio listening on port ${server.address().port}`));
  for (const signal of ["SIGTERM", "SIGINT"]) process.on(signal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  });
}
