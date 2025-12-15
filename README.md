Insecure Shop (Training App)
================================

Warning: This application is intentionally vulnerable to SQL injection and is provided for educational use only in a closed, controlled environment. Do not deploy this application to the public internet or use real data.

Overview
--------
- Backend: Node.js (Express) with MySQL
- Frontend: Simple server-rendered HTML
- Focus: A `products` table with three visible clothing items and two hidden `Sneakers` items (different colors). The search feature is intentionally vulnerable to SQL injection for training.

What’s included
---------------
- Server: `server.js`
- Schema & seed: `db.sql`
- Config template: `.env.sample`
- Package manifest: `package.json`

Setup
-----
1) Requirements
- Node.js 18+ and npm
- MySQL 8+ (local instance is fine)

2) Database
Run the SQL file to create the database and seed data:

```bash
mysql -u root -p < db.sql
```

This creates a database `ont_shop` with a `products` table containing:
- 3 visible clothing items (T-Shirt, Jeans, Jacket)
- 2 hidden `Sneakers` variants (Red, Blue)

3) Configure environment
Copy `.env.sample` to `.env` and set credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ont_shop
PORT=3000
```

4) Install dependencies

```bash
npm install
```

5) Run the app

```bash
npm start
```

Open http://localhost:3000

Using the vulnerability (for training)
--------------------------------------
The home page lists only visible products. The `/search` feature concatenates user input into a SQL query (intentionally unsafe). Try entering this payload in the search box to observe how hidden items can be revealed:

```
%' OR 1=1) OR 1=1 -- 
```

Notes:
- The page displays the executed SQL so you can study the effect.
- Spacing after `--` matters in MySQL for comments.

Hardening discussion
--------------------
This project is deliberately insecure by design. In real applications you must:
- Use parameterized queries/prepared statements
- Apply least-privilege DB users and avoid granting unnecessary permissions
- Validate and sanitize all user input
- Apply proper query structure and avoid string concatenation for SQL
- Add monitoring and WAF where appropriate

License
-------
For educational use only.
# ONT_webohjelma
