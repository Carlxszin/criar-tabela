const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.json());

const blockedPath = path.join(__dirname, 'data', 'blocked.json');

app.get('/api/blocked', (req, res) => {
  const data = fs.readFileSync(blockedPath);
  res.json(JSON.parse(data));
});

app.post('/api/block', (req, res) => {
  const { site } = req.body;
  let data = JSON.parse(fs.readFileSync(blockedPath));
  if (!data.includes(site)) data.push(site);
  fs.writeFileSync(blockedPath, JSON.stringify(data));
  res.json({ success: true });
});

app.post('/api/unblock', (req, res) => {
  const { site } = req.body;
  let data = JSON.parse(fs.readFileSync(blockedPath));
  data = data.filter(s => s !== site);
  fs.writeFileSync(blockedPath, JSON.stringify(data));
  res.json({ success: true });
});

app.post('/api/log', (req, res) => {
  const { site, status } = req.body;
  const log = `[${new Date().toISOString()}] Tentativa de acessar ${site} - ${status}\n`;
  fs.appendFileSync('access.log', log);
  res.json({ success: true });
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
