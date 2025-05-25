const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./docesabor.db', err => {
  if (err) throw err
})

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON')
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nomeCompleto TEXT NOT NULL,
    nomeUsuario TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    endereco TEXT NOT NULL
  )`)
  db.run(`CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    preco REAL NOT NULL,
    imagemUrl TEXT
  )`)
  db.run(`CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuarioId INTEGER NOT NULL,
    horarioRetirada DATETIME,
    status TEXT DEFAULT 'pendente',
    criadoEm DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
  )`)
  db.run(`CREATE TABLE IF NOT EXISTS pedido_produtos (
    pedidoId INTEGER NOT NULL,
    produtoId INTEGER NOT NULL,
    quantidade INTEGER NOT NULL,
    PRIMARY KEY (pedidoId, produtoId),
    FOREIGN KEY (pedidoId) REFERENCES pedidos(id),
    FOREIGN KEY (produtoId) REFERENCES produtos(id)
  )`)
})

module.exports = db
