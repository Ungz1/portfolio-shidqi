const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

let PORT = parseInt(process.env.PORT, 10) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === '/') {
    pathname = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, pathname);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(`
        <div style="font-family:sans-serif; text-align:center; padding:50px; background:#0b0f19; color:#fff; min-height:100vh;">
          <h1 style="color:#ef4444;">404 - Halaman Tidak Ditemukan</h1>
          <p>File: ${pathname}</p>
          <a href="/" style="color:#38bdf8; text-decoration:underline;">Kembali ke Beranda</a>
        </div>
      `);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Content-Length': stats.size
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

function listen(port) {
  server.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log('========================================================');
    console.log(`🚀 Portofolio Interaktif Shidqi Aktif Berjalan!`);
    console.log(`🌐 Buka di Browser: \x1b[36m${url}\x1b[0m`);
    console.log(`📁 Melayani file dari: ${PUBLIC_DIR}`);
    console.log(`🛑 Tekan CTRL + C di terminal untuk menghentikan server`);
    console.log('========================================================');

    if (process.platform === 'win32') {
      exec(`start ${url}`);
    }
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`⚠️  Port ${PORT} sedang dipakai aplikasi lain. Beralih otomatis ke port ${PORT + 1}...`);
    PORT++;
    listen(PORT);
  } else {
    console.error('Terjadi kesalahan server:', err);
  }
});

listen(PORT);
