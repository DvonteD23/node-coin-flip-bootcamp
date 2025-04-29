const http        = require('http');
const fs          = require('fs');
const url         = require('url');
const querystring = require('querystring');

const PORT = 8000;

function serveFile(path, contentType, res) {
  fs.readFile(path, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('Server Error');
    }
    res.writeHead(200, contentType ? { 'Content-Type': contentType } : {});
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url);
  const params = querystring.parse(query);


  if (pathname === '/' || pathname === '/index.html') {
    return serveFile('index.html', 'text/html', res);
  }


  if (pathname === '/css/style.css') {
    return serveFile('css/style.css', 'text/css', res);
  }

 
  if (pathname === '/js/main.js') {
    return serveFile('js/main.js', 'application/javascript', res);
  }

  if (pathname === '/api') {
    const mode = params.mode;
    const flip = Math.random() < 0.5 ? 'heads' : 'tails';

    if (mode === 'single') {
      const { player1Name, player1Age, guess } = params;
      if (!player1Name || !player1Age || !guess) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Missing single-player params' }));
      }
      const win = flip === guess;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ flip, win }));
    }


    if (mode === 'two') {
      const { player1Name, player2Name, guess1, guess2 } = params;
      if (!player1Name || !player2Name || !guess1 || !guess2) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Missing two-player params' }));
      }
      const win1 = flip === guess1;
      const win2 = flip === guess2;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ flip, win1, win2 }));
    }


    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Invalid mode' }));
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
}); 


server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
