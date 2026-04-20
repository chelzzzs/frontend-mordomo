import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';

// 1. IMPORTAÇÕES DA CONSTELAÇÃO
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const CORES_PIZZA = ['#00F0FF', '#007BFF', '#8A2BE2', '#FF007F', '#00FA9A'];

function PainelPrincipal({ aoSair }) {
  const [mensagens, setMensagens] = useState([{ remetente: 'mordomo', texto: 'Sistemas online. Monitoramento financeiro ativado, Senhor.' }]);
  const [mensagemDigitada, setMensagemDigitada] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [init, setInit] = useState(false); // Estado para saber se as partículas carregaram

  const [dados, setDados] = useState({
    saldo_atual: 0, total_receitas: 0, total_despesas: 0,
    grafico_pizza: [], grafico_linha: [], ultimas_transacoes: [], categorias: []
  });

  const [formManual, setFormManual] = useState({ descricao: '', valor: '', categoria_id: '', tipo: 'despesa' });

  // 2. INICIALIZADOR DO MOTOR DE PARTÍCULAS
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const carregarDashboard = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get('http://127.0.0.1:8000/api/dashboard/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDados(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { carregarDashboard(); }, []);

  const salvarManual = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://127.0.0.1:8000/api/dashboard/', formManual, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormManual({ descricao: '', valor: '', categoria_id: '', tipo: 'despesa' });
      carregarDashboard();
    } catch (err) { alert("Erro ao salvar"); }
  };

  const enviarChat = async (e) => {
    e.preventDefault();
    if (!mensagemDigitada.trim()) return;
    setMensagens(p => [...p, { remetente: 'usuario', texto: mensagemDigitada }]);
    setCarregando(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.post('http://127.0.0.1:8000/api/chat/', { mensagem: mensagemDigitada }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensagens(p => [...p, { remetente: 'mordomo', texto: res.data.resposta_mordomo }]);
      setMensagemDigitada('');
      carregarDashboard();
    } finally { setCarregando(false); }
  };

  const formatar = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  // 3. A RECEITA DA CONSTELAÇÃO (Parâmetros visuais)
  const configuracaoParticulas = useMemo(() => ({
    background: {
      color: { value: "#0A1118" }, // Fundo espacial
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "grab" }, // Linhas grudam no mouse
      },
      modes: {
        grab: { distance: 150, links: { opacity: 0.5 } },
      },
    },
    particles: {
      color: { value: "#00F0FF" }, // Cor Neon dos pontos
      links: {
        color: "#00F0FF", // Cor Neon das linhas
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.8, // Velocidade suave e sofisticada
        direction: "none",
        random: false,
        straight: false,
        outModes: { default: "bounce" },
      },
      number: {
        density: { enable: true, area: 800 },
        value: 60, // Quantidade de estrelas
      },
      opacity: { value: 0.5 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  }), []);

  return (
    // position: 'relative' no wrapper principal para conter o z-index
    <div style={{ position: 'relative', display: 'flex', minHeight: '100vh', backgroundColor: '#0A1118', color: '#E2E8F0', fontFamily: '"Inter", sans-serif' }}>
      
      {/* O COMPONENTE DAS PARTÍCULAS RENDERIZANDO NO FUNDO */}
      {init && (
        <Particles
          id="tsparticles"
          options={configuracaoParticulas}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
        />
      )}

      {/* Z-INDEX: 1 PARA O CONTEÚDO FICAR POR CIMA DAS PARTÍCULAS */}
      <div style={{ flex: 2, padding: '40px', display: 'flex', flexDirection: 'column', gap: '35px', zIndex: 1 }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontWeight: '600', letterSpacing: '-0.5px' }}>Dashboard Financeiro</h1>
            <p style={{ margin: '5px 0 0 0', color: '#94A3B8', fontSize: '14px' }}>Painel interativo com KPIs em tempo real.</p>
          </div>
          <button onClick={aoSair} style={{ backgroundColor: 'rgba(255, 50, 50, 0.1)', color: '#ff4d4d', border: '1px solid rgba(255, 50, 50, 0.3)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}>
            Desconectar
          </button>
        </div>

        {/* CARDS TOTAIS */}
        <div style={{ display: 'flex', gap: '25px' }}>
          <Card titulo="SALDO ATUAL" valor={formatar(dados.saldo_atual)} cor="#00F0FF" />
          <Card titulo="ENTRADAS (MÊS)" valor={formatar(dados.total_receitas)} cor="#00FA9A" />
          <Card titulo="SAÍDAS (MÊS)" valor={formatar(dados.total_despesas)} cor="#FF007F" />
        </div>

        <div style={{ display: 'flex', gap: '25px' }}>
          
          {/* FORMULÁRIO MANUAL */}
          <div style={glassCardStyle}>
            <h3 style={cardTitleStyle}>📍 Nova Transação</h3>
            <form onSubmit={salvarManual} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Descrição..." value={formManual.descricao} onChange={e => setFormManual({...formManual, descricao: e.target.value})} style={inputStyle} required />
              <input type="number" placeholder="Valor (Ex: 50.00)" value={formManual.valor} onChange={e => setFormManual({...formManual, valor: e.target.value})} style={inputStyle} required />
              <select value={formManual.categoria_id} onChange={e => setFormManual({...formManual, categoria_id: e.target.value})} style={inputStyle} required>
                <option value="" style={{color: '#000'}}>Selecione a Categoria</option>
                {dados.categorias.map(c => <option key={c.id} value={c.id} style={{color: '#000'}}>{c.nome}</option>)}
              </select>
              <select value={formManual.tipo} onChange={e => setFormManual({...formManual, tipo: e.target.value})} style={inputStyle}>
                <option value="despesa" style={{color: '#000'}}>Despesa (Saída)</option>
                <option value="receita" style={{color: '#000'}}>Receita (Entrada)</option>
              </select>
              <button type="submit" style={btnNeonStyle}>ADICIONAR</button>
            </form>
          </div>

          {/* GRÁFICO DE PIZZA */}
          <div style={{ ...glassCardStyle, flex: 1.5, minHeight: '380px' }}>
            <h3 style={cardTitleStyle}>📊 Distribuição</h3>
            <div style={{ flex: 1, width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dados.grafico_pizza} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                    {dados.grafico_pizza.map((entry, index) => <Cell key={`cell-${index}`} fill={CORES_PIZZA[index % CORES_PIZZA.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '8px', color: '#fff' }} formatter={(v) => formatar(v)} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#94A3B8' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* GRÁFICO DE LINHA NEON */}
        <div style={{ ...glassCardStyle, height: '450px' }}>
          <h3 style={cardTitleStyle}>📈 Evolução do Cofre</h3>
          <div style={{ flex: 1, width: '100%', height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dados.grafico_linha}>
                <defs>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                <XAxis dataKey="dia" stroke="#64748B" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '8px', color: '#fff' }} formatter={(v) => formatar(v)} />
                <Area type="monotone" dataKey="saldo" stroke="#00F0FF" fillOpacity={1} fill="url(#colorSaldo)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA: CHAT MORDOMO */}
      <div style={{ width: '420px', padding: '40px 40px 40px 0', position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 1 }}>
        
        <div style={{ height: '70%', minHeight: '500px', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexDirection: 'column', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden' }}>
          
          <div style={{ padding: '25px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', color: '#00F0FF', letterSpacing: '1px', textTransform: 'uppercase' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#00F0FF', borderRadius: '50%', boxShadow: '0 0 10px #00F0FF' }}></span>
              Mordomo IA
            </h3>
            {carregando && <span style={{fontSize: '12px', color: '#94A3B8'}}>Processando...</span>}
          </div>

          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {mensagens.map((m, i) => (
              <div key={i} style={{ 
                alignSelf: m.remetente === 'usuario' ? 'flex-end' : 'flex-start', 
                backgroundColor: m.remetente === 'usuario' ? 'rgba(0, 240, 255, 0.1)' : 'rgba(30, 41, 59, 0.8)', 
                border: m.remetente === 'usuario' ? '1px solid rgba(0, 240, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.05)',
                color: m.remetente === 'usuario' ? '#00F0FF' : '#E2E8F0', 
                padding: '14px 18px', 
                borderRadius: '16px', 
                maxWidth: '85%',
                borderBottomRightRadius: m.remetente === 'usuario' ? '4px' : '16px',
                borderBottomLeftRadius: m.remetente === 'mordomo' ? '4px' : '16px',
              }}>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>{m.texto}</p>
              </div>
            ))}
          </div>

          <form onSubmit={enviarChat} style={{ padding: '20px', display: 'flex', gap: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <input 
              type="text" 
              value={mensagemDigitada} 
              onChange={e => setMensagemDigitada(e.target.value)} 
              placeholder="Digite seu comando..." 
              disabled={carregando}
              style={{ ...inputStyle, flex: 1 }} 
            />
            <button type="submit" disabled={carregando} style={btnNeonStyle}>Ir</button>
          </form>
        </div>
      </div>
    </div>
  );
}


const glassCardStyle = {
  flex: 1,
  backgroundColor: 'rgba(15, 23, 42, 0.15)', 
  backdropFilter: 'blur(6px)', 
  border: '1px solid rgba(255, 255, 255, 0.08)',
  padding: '30px', 
  borderRadius: '20px', 
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
};

const cardTitleStyle = {
  margin: '0 0 20px 0', 
  color: '#94A3B8', 
  fontSize: '14px', 
  fontWeight: '600', 
  textTransform: 'uppercase', 
  letterSpacing: '1px'
};

const inputStyle = { 
  padding: '14px', 
  borderRadius: '10px', 
  backgroundColor: 'rgba(15, 23, 42, 0.6)', 
  border: '1px solid rgba(255, 255, 255, 0.1)', 
  color: '#E2E8F0',
  fontSize: '14px', 
  outline: 'none',
  transition: '0.3s'
};

const btnNeonStyle = {
  padding: '14px 25px', 
  backgroundColor: 'transparent', 
  color: '#00F0FF', 
  border: '1px solid #00F0FF', 
  borderRadius: '10px', 
  cursor: 'pointer', 
  fontWeight: 'bold', 
  fontSize: '14px',
  boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)',
  textTransform: 'uppercase',
  letterSpacing: '1px'
};

const Card = ({ titulo, valor, cor }) => (
  <div style={glassCardStyle}>
    <p style={{ margin: 0, color: '#94A3B8', fontSize: '12px', fontWeight: '800', letterSpacing: '1px' }}>{titulo}</p>
    <h2 style={{ margin: '10px 0 0 0', color: cor, fontSize: '32px', textShadow: `0 0 20px ${cor}40` }}>{valor}</h2>
  </div>
);

export default PainelPrincipal;