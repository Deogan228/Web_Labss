// Прокси к DummyJSON с управляемой задержкой и ошибками — для проверки состояний интерфейса.
// Управление: GET /__control?delay=3000&fail=1
import http from 'node:http';

let delay = 0;
let fail = false;

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/__control') {
    if (url.searchParams.has('delay')) delay = Number(url.searchParams.get('delay'));
    if (url.searchParams.has('fail')) fail = url.searchParams.get('fail') === '1';
    res.end(JSON.stringify({ delay, fail }));
    return;
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  await new Promise((r) => setTimeout(r, delay));

  if (fail) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end('{"message":"mock failure"}');
    return;
  }

  const upstream = await fetch('https://dummyjson.com' + req.url, {
    method: req.method,
    headers: { 'Content-Type': req.headers['content-type'] ?? 'application/json' },
    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : Buffer.concat(chunks),
  });
  res.writeHead(upstream.status, { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json' });
  res.end(Buffer.from(await upstream.arrayBuffer()));
}).listen(4010, '127.0.0.1', () => console.log('mock api on 4010'));
