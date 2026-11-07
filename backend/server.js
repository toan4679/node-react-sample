// Backend mẫu (Node, không phụ thuộc thư viện ngoài): đọc PORT và DATABASE_URL từ biến môi trường
const http = require("http");
const net = require("net");
const port = process.env.PORT || 8000;

function checkDb(cb) {
  const raw = process.env.DATABASE_URL;
  if (!raw) return cb({ configured: false });
  const u = new URL(raw);
  const s = net.connect({ host: u.hostname, port: Number(u.port) || 5432, timeout: 2000 });
  s.on("connect", () => { s.destroy(); cb({ configured: true, reachable: true }); });
  s.on("error", () => cb({ configured: true, reachable: false }));
  s.on("timeout", () => { s.destroy(); cb({ configured: true, reachable: false }); });
}

http.createServer((req, res) => {
  const send = (obj) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(obj)); };
  if (req.url === "/api/health") return send({ status: "ok" });
  if (req.url === "/api/hello") return send({ message: "Xin chào từ backend Node.js", runtime: "node" });
  if (req.url === "/api/db") return checkDb(send);
  res.statusCode = 404; send({ error: "not found" });
}).listen(port, "0.0.0.0", () => console.log("listening on " + port));
