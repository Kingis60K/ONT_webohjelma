require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ont_shop',
  multipleStatements: false
});

function renderPage(title, body) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { font-family: system-ui, Arial, sans-serif; margin: 2rem; }
    h1 { margin-bottom: 0.5rem; }
    .hint { color: #555; font-size: 0.95rem; margin-bottom: 1rem; }
    form { margin: 1rem 0; }
    input[type=text] { padding: 0.5rem; width: 300px; }
    button { padding: 0.5rem 0.75rem; }
    table { border-collapse: collapse; width: 100%; margin-top: 1rem; }
    th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
    th { background: #f7f7f7; }
    code { background: #f2f2f2; padding: 0.1rem 0.25rem; border-radius: 3px; }
    .sql { white-space: pre-wrap; word-break: break-all; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    .notice { background: #fff8e1; border: 1px solid #ffe082; padding: 0.75rem; border-radius: 6px; }
  </style>
  <meta name="robots" content="noindex,nofollow" />
  <meta name="referrer" content="no-referrer" />
  <meta http-equiv="X-Content-Type-Options" content="nosniff" />
</head>
<body>
  ${body}
</body>
</html>`;
}

function renderProductsTable(rows, showVisibleColumn = false) {
  const headers = ['ID', 'Name', 'Category', 'Color', 'Price'].concat(showVisibleColumn ? ['Visible'] : []);
  const thead = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
  const tbody = rows.map(r => {
    const base = [r.id, r.name, r.category || '', r.color || '', Number(r.price).toFixed(2)];
    const cells = base.concat(showVisibleColumn ? [String(r.visible)] : []);
    return `<tr>${cells.map(v => `<td>${v}</td>`).join('')}</tr>`;
  }).join('');
  return `<table>${thead}${tbody}</table>`;
}

function renderSearchForm(q) {
  return `<form action="/search" method="get">
    <input type="text" name="q" placeholder="Search products..." value="${q || ''}" />
    <button type="submit">Search</button>
  </form>`;
}

app.get('/', (req, res) => {
  const sql = "SELECT id, name, category, color, price FROM products WHERE visible=1 ORDER BY id";
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).send(renderPage('Error', `<h1>Database Error</h1><pre>${String(err)}</pre>`));
      return;
    }
    const content = `
      <h1>Insecure Shop</h1>
      <div class="hint">Showing only visible products. Try the search to explore.</div>
      ${renderSearchForm('')}
      ${renderProductsTable(rows)}
    `;
    res.send(renderPage('Insecure Shop', content));
  });
});

app.get('/search', (req, res) => {
  const q = (req.query.q || '').toString();
  const sql = "SELECT id, name, category, color, price, visible FROM products WHERE (visible=1) AND (name LIKE '%" + q + "%' OR category LIKE '%" + q + "%' OR color LIKE '%" + q + "%') ORDER BY id";
  db.query(sql, (err, rows) => {
    if (err) {
      const body = `
        <h1>Search</h1>
        ${renderSearchForm(q)}
        <div class="notice"><strong>Query errored:</strong></div>
        <pre class="sql">${sql}</pre>
        <pre>${String(err)}</pre>
        <p><a href="/">Back</a></p>
      `;
      res.status(400).send(renderPage('Search Error', body));
      return;
    }
    const body = `
      <h1>Search</h1>
      ${renderSearchForm(q)}
      <div class="notice"><strong>Executed query (intentionally unsafe):</strong></div>
      <pre class="sql">${sql}</pre>
      ${renderProductsTable(rows, true)}
      <p><a href="/">Back</a></p>
    `;
    res.send(renderPage('Search', body));
  });
});

app.use((req, res) => {
  res.status(404).send(renderPage('Not Found', '<h1>404 Not Found</h1><p><a href="/">Home</a></p>'));
});

app.listen(PORT, () => {
  console.log(`Insecure Shop listening on http://localhost:${PORT}`);
});
