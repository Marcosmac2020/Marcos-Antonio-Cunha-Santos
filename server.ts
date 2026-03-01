import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("pericia.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS processos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero TEXT,
    reclamante TEXT,
    reclamada TEXT,
    perito TEXT,
    assistentes TEXT,
    data_nomeacao TEXT,
    prazo_entrega TEXT,
    data_vistoria TEXT,
    contatos TEXT,
    status TEXT DEFAULT 'nomeacao',
    objeto_pericia TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS pericias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    processo_id INTEGER,
    data TEXT,
    hora TEXT,
    local TEXT,
    tipo TEXT,
    FOREIGN KEY(processo_id) REFERENCES processos(id)
  );

  CREATE TABLE IF NOT EXISTS quesitos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    processo_id INTEGER,
    origem TEXT, -- 'autor', 'reu', 'juiz'
    pergunta TEXT,
    resposta TEXT,
    FOREIGN KEY(processo_id) REFERENCES processos(id)
  );

  CREATE TABLE IF NOT EXISTS lancamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT, -- 'receita', 'despesa'
    valor REAL,
    descricao TEXT,
    processo_id INTEGER,
    data_lancamento TEXT,
    FOREIGN KEY(processo_id) REFERENCES processos(id)
  );
`);

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get("/api/processos", (req, res) => {
    const rows = db.prepare("SELECT * FROM processos ORDER BY created_at DESC").all();
    res.json(rows);
  });

  app.post("/api/processos", (req, res) => {
    const { numero, reclamante, reclamada, perito, assistentes, data_nomeacao, prazo_entrega, data_vistoria, contatos, objeto_pericia } = req.body;
    const info = db.prepare(`
      INSERT INTO processos (numero, reclamante, reclamada, perito, assistentes, data_nomeacao, prazo_entrega, data_vistoria, contatos, objeto_pericia)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(numero, reclamante, reclamada, perito, assistentes, data_nomeacao, prazo_entrega, data_vistoria, contatos, objeto_pericia);
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/processos/:id", (req, res) => {
    const processo = db.prepare("SELECT * FROM processos WHERE id = ?").get(req.params.id);
    const pericias = db.prepare("SELECT * FROM pericias WHERE processo_id = ?").all(req.params.id);
    const quesitos = db.prepare("SELECT * FROM quesitos WHERE processo_id = ?").all(req.params.id);
    res.json({ ...processo, pericias, quesitos });
  });

  app.patch("/api/processos/:id", (req, res) => {
    const { status, data_vistoria } = req.body;
    if (status) {
      db.prepare("UPDATE processos SET status = ? WHERE id = ?").run(status, req.params.id);
    }
    if (data_vistoria) {
      db.prepare("UPDATE processos SET data_vistoria = ? WHERE id = ?").run(data_vistoria, req.params.id);
    }
    res.json({ success: true });
  });

  app.get("/api/financeiro", (req, res) => {
    const rows = db.prepare("SELECT * FROM lancamentos ORDER BY data_lancamento DESC").all();
    res.json(rows);
  });

  app.post("/api/financeiro", (req, res) => {
    const { tipo, valor, descricao, processo_id, data_lancamento } = req.body;
    const info = db.prepare(`
      INSERT INTO lancamentos (tipo, valor, descricao, processo_id, data_lancamento)
      VALUES (?, ?, ?, ?, ?)
    `).run(tipo, valor, descricao, processo_id, data_lancamento);
    res.json({ id: info.lastInsertRowid });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
