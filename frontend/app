import { useState, useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom'

function CadastroForm() {
  const [form, setForm] = useState({ nomeCompleto: '', nomeUsuario: '', email: '', endereco: '' })
  const navigate = useNavigate()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const res = await axios.post('/api/usuarios', form)
    localStorage.setItem('userId', res.data.id)
    navigate('/produtos')
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2 style={{ backgroundColor: '#6A0DAD', color: '#fff', padding: 10, textAlign: 'center' }}>Doce Sabor</h2>
      <div style={{ textAlign: 'center' }}>
        <img src="/logo.png" alt="Logo" style={{ width: '50%', maxWidth: 150 }} />
      </div>
      <input style={{ width: '100%', marginBottom: 10, padding: 10 }} name="nomeCompleto" placeholder="Nome Completo" onChange={handleChange} required />
      <input style={{ width: '100%', marginBottom: 10, padding: 10 }} name="nomeUsuario" placeholder="Nome de Usuário" onChange={handleChange} required />
      <input style={{ width: '100%', marginBottom: 10, padding: 10 }} name="email" placeholder="Email" onChange={handleChange} required />
      <input style={{ width: '100%', marginBottom: 10, padding: 10 }} name="endereco" placeholder="Endereço" onChange={handleChange} required />
      <button type="submit" style={{ width: '100%', padding: 12, backgroundColor: '#FF69B4', color: '#fff', fontSize: 16 }}>Cadastrar</button>
    </form>
  )
}

function ProdutosList() {
  const [produtos, setProdutos] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/api/produtos').then(res => setProdutos(res.data))
  }, [])

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h2 style={{ backgroundColor: '#6A0DAD', color: '#fff', padding: 10, textAlign: 'center' }}>Produtos</h2>
      {produtos.map(produto => (
        <div key={produto.id} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10, borderRadius: 8 }}>
          <h3>{produto.nome}</h3>
          <p>{produto.descricao}</p>
          <p>R$ {produto.preco}</p>
          <img src={produto.imagemUrl} alt={produto.nome} style={{ width: '100%', maxWidth: 200, display: 'block', marginBottom: 10 }} />
          <button onClick={() => navigate(`/pedido/${produto.id}`)} style={{ width: '100%', padding: 10, backgroundColor: '#FF69B4', color: '#fff' }}>Pedir</button>
        </div>
      ))}
    </div>
  )
}

function PedidoForm({ produtoId }) {
  const [quantidade, setQuantidade] = useState(1)
  const [horarioRetirada, setHorarioRetirada] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    const usuarioId = localStorage.getItem('userId')
    await axios.post('/api/pedidos', {
      usuarioId,
      produtos: [{ produtoId, quantidade }],
      horarioRetirada
    })
    navigate('/meus-pedidos')
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2 style={{ backgroundColor: '#6A0DAD', color: '#fff', padding: 10, textAlign: 'center' }}>Confirmar Pedido</h2>
      <input type="number" min="1" value={quantidade} onChange={e => setQuantidade(e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 10 }} required />
      <input type="datetime-local" value={horarioRetirada} onChange={e => setHorarioRetirada(e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 10 }} required />
      <button type="submit" style={{ width: '100%', padding: 12, backgroundColor: '#FF69B4', color: '#fff', fontSize: 16 }}>Confirmar</button>
    </form>
  )
}

function MeusPedidos() {
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    const usuarioId = localStorage.getItem('userId')
    axios.get(`/api/pedidos/${usuarioId}`).then(res => setPedidos(res.data))
  }, [])

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h2 style={{ backgroundColor: '#6A0DAD', color: '#fff', padding: 10, textAlign: 'center' }}>Meus Pedidos</h2>
      {pedidos.map(pedido => (
        <div key={pedido.pedidoId} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10, borderRadius: 8 }}>
          <p>Status: {pedido.status}</p>
          <p>Retirada: {pedido.horarioRetirada}</p>
          <p>Feito em: {pedido.criadoEm}</p>
          <ul>
            {pedido.produtos.map((p, i) => (
              <li key={i}>{p.nome} - {p.quantidade} x R$ {p.preco}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CadastroForm />} />
        <Route path="/produtos" element={<ProdutosList />} />
        <Route path="/pedido/:produtoId" element={<PedidoFormWrapper />} />
        <Route path="/meus-pedidos" element={<MeusPedidos />} />
      </Routes>
    </Router>
  )
}

function PedidoFormWrapper() {
  const { produtoId } = useParams()
  return <PedidoForm produtoId={produtoId} />
}

export default App
