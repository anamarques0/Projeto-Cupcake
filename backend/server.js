const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./database')

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.post('/api/usuarios', (req, res) => {
  const { nomeCompleto, nomeUsuario, email, endereco } = req.body
  db.run(
    `INSERT INTO usuarios (nomeCompleto, nomeUsuario, email, endereco) VALUES (?, ?, ?, ?)`,
    [nomeCompleto, nomeUsuario, email, endereco],
    function (err) {
      if (err) return res.status(400).json({ error: err.message })
      res.json({ id: this.lastID, nomeCompleto, nomeUsuario, email, endereco })
    }
  )
})

app.put('/api/usuarios/:id', (req, res) => {
  const id = req.params.id
  const { nomeCompleto, nomeUsuario, email, endereco } = req.body
  db.run(
    `UPDATE usuarios SET nomeCompleto = ?, nomeUsuario = ?, email = ?, endereco = ? WHERE id = ?`,
    [nomeCompleto, nomeUsuario, email, endereco, id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message })
      if (this.changes === 0) return res.status(404).json({ error: 'Usuário não encontrado' })
      res.json({ id, nomeCompleto, nomeUsuario, email, endereco })
    }
  )
})

app.get('/api/produtos', (req, res) => {
  db.all(`SELECT * FROM produtos`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
})

app.post('/api/produtos', (req, res) => {
  const { nome, descricao, preco, imagemUrl } = req.body
  db.run(
    `INSERT INTO produtos (nome, descricao, preco, imagemUrl) VALUES (?, ?, ?, ?)`,
    [nome, descricao, preco, imagemUrl],
    function (err) {
      if (err) return res.status(400).json({ error: err.message })
      res.json({ id: this.lastID, nome, descricao, preco, imagemUrl })
    }
  )
})

app.post('/api/pedidos', (req, res) => {
  const { usuarioId, produtos, horarioRetirada } = req.body
  if (!usuarioId || !produtos || !produtos.length) {
    return res.status(400).json({ error: 'Dados incompletos' })
  }
  db.run(
    `INSERT INTO pedidos (usuarioId, horarioRetirada) VALUES (?, ?)`,
    [usuarioId, horarioRetirada],
    function (err) {
      if (err) return res.status(400).json({ error: err.message })
      const pedidoId = this.lastID
      const stmt = db.prepare(`INSERT INTO pedido_produtos (pedidoId, produtoId, quantidade) VALUES (?, ?, ?)`)
      produtos.forEach(p => {
        stmt.run(pedidoId, p.produtoId, p.quantidade)
      })
      stmt.finalize()
      res.json({ pedidoId, usuarioId, produtos, horarioRetirada, status: 'pendente' })
    }
  )
})

app.get('/api/pedidos/:usuarioId', (req, res) => {
  const usuarioId = req.params.usuarioId
  db.all(
    `SELECT p.id as pedidoId, p.horarioRetirada, p.status, p.criadoEm,
      pp.produtoId, pr.nome as produtoNome, pp.quantidade, pr.preco
      FROM pedidos p
      JOIN pedido_produtos pp ON p.id = pp.pedidoId
      JOIN produtos pr ON pp.produtoId = pr.id
      WHERE p.usuarioId = ?`,
    [usuarioId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      const pedidosMap = {}
      rows.forEach(row => {
        if (!pedidosMap[row.pedidoId]) {
          pedidosMap[row.pedidoId] = {
            pedidoId: row.pedidoId,
            horarioRetirada: row.horarioRetirada,
            status: row.status,
            criadoEm: row.criadoEm,
            produtos: []
          }
        }
        pedidosMap[row.pedidoId].produtos.push({
          produtoId: row.produtoId,
          nome: row.produtoNome,
          quantidade: row.quantidade,
          preco: row.preco
        })
      })
      res.json(Object.values(pedidosMap))
    }
  )
})

const PORT = process.env.PORT || 3000
app.listen(PORT)
