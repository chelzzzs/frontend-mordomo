import { useState } from 'react'
import axios from 'axios'
import PainelPrincipal from './components/PainelPrincipal'


function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // O React verifica se já temos uma chave guardada de antes
  const [token, setToken] = useState(localStorage.getItem('access_token'))
  const [erro, setErro] = useState('')

  // Função que bate na porta do Django para pedir a chave
  const fazerLogin = async (e) => {
    e.preventDefault() // Evita que a página recarregue
    try {
      const resposta = await axios.post('http://127.0.0.1:8000/api/token/', {
        username: username,
        password: password
      })
      
      // Se a senha estiver certa, guarda a chave no navegador e limpa os erros
      localStorage.setItem('access_token', resposta.data.access)
      setToken(resposta.data.access)
      setErro('')
      
    } catch (err) {
      setErro('Credenciais inválidas. O Mordomo não reconheceu este usuário.')
    }
  }

  // Função para "jogar a chave fora" (Sair)
  const fazerLogout = () => {
    localStorage.removeItem('access_token')
    setToken(null)
  }

  // SE NÃO TEM TOKEN: Renderiza a Tela de Login
  if (!token) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h2>🎩 Acesso ao Mordomo</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Identifique-se para acessar seu cofre.</p>
        
        <form onSubmit={fazerLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" 
            placeholder="Usuário" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <input 
            type="password" 
            placeholder="Senha" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '12px', backgroundColor: '#2c3e50', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Destrancar Cofre
          </button>
        </form>
        {erro && <p style={{ color: '#e74c3c', marginTop: '15px', fontWeight: 'bold' }}>{erro}</p>}
      </div>
    )
  }

  // SE TEM TOKEN: Renderiza a Tela Principal (Por enquanto, um aviso de sucesso)
// SE TEM TOKEN: Renderiza o Painel Principal
  return (
    <PainelPrincipal aoSair={fazerLogout} />
  )
}

export default App