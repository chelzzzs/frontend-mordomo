import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

// Importando meus novos blocos fatiados
import ChatMordomo from './ChatMordomo';
import FormulariosRendaDespesa from './FormulariosRendaDespesa';
import CardsPrincipais from './CardsPrincipais';

const CORES_PIZZA = ['#00F0FF', '#007BFF', '#8A2BE2', '#FF007F', '#00FA9A'];

// Estilos que sobraram para a mesa principal
const glassCardStyle = { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.15)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' };
const cardTitleStyle = { margin: '0 0 20px 0', color: '#94A3B8', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' };
const inputStyle = { padding: '14px', borderRadius: '10px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#E2E8F0', fontSize: '14px', outline: 'none', transition: '0.3s' };
const btnNeonStyle = { padding: '14px 25px', backgroundColor: 'transparent', color: '#00F0FF', border: '1px solid #00F0FF', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)', textTransform: 'uppercase', letterSpacing: '1px' };

function PainelPrincipal({ aoSair }) {
  const [mensagens, setMensagens] = useState([{ remetente: 'mordomo', texto: 'Sistemas online. Monitoramento financeiro ativado, Senhor.' }]);
  const [mensagemDigitada, setMensagemDigitada] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [init, setInit] = useState(false); 

  const [dados, setDados] = useState({
    saldo_atual: 0, total_receitas: 0, total_despesas: 0,
    grafico_pizza: [], grafico_linha: [], ultimas_transacoes: [], categorias: []
  });
  const [formManual, setFormManual] = useState({ descricao: '', valor: '', categoria_id: '', tipo: 'despesa' });

  const [renda, setRenda] = useState(0); 
  const [novaRendaInput, setNovaRendaInput] = useState('');
  const [despesas, setDespesas] = useState([]);
  const [novaDespesa, setNovaDespesa] = useState({ descricao: '', valor: '', parcelas_totais: '' });

  useEffect(() => {
    carregarMeusDados();
    carregarDashboard();
  }, []);

  const carregarMeusDados = async () => {
    const token = localStorage.getItem('access_token'); 
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    try {
      const resRenda = await fetch('http://127.0.0.1:8000/api/perfil/', { headers });
      if (resRenda.ok) {
        const dadosRenda = await resRenda.json();
        setRenda(dadosRenda.renda_mensal);
      }
      const resDespesas = await fetch('http://127.0.0.1:8000/api/despesas-fixas/', { headers });
      if (resDespesas.ok) {
        const dadosDespesas = await resDespesas.json();
        setDespesas(dadosDespesas);
      }
    } catch (error) { console.error("Erro ao carregar dados:", error); }
  };

  const salvarNovaRenda = async () => {
    const token = localStorage.getItem('access_token');
    const res = await fetch('http://127.0.0.1:8000/api/perfil/', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ renda_mensal: novaRendaInput })
    });
    if (res.ok) { setRenda(novaRendaInput); setNovaRendaInput(''); }
  };

  const salvarNovaDespesa = async () => {
    const token = localStorage.getItem('access_token');
    const dadosParaEnviar = { descricao: novaDespesa.descricao, valor: novaDespesa.valor, parcelas_totais: novaDespesa.parcelas_totais ? novaDespesa.parcelas_totais : null };
    try {
      const res = await fetch('http://127.0.0.1:8000/api/despesas-fixas/', {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(dadosParaEnviar)
      });
      if (res.ok) {
        alert("✅ Despesa adicionada com sucesso!"); 
        carregarMeusDados(); 
        setNovaDespesa({ descricao: '', valor: '', parcelas_totais: '' }); 
      } else { alert("❌ Erro ao salvar! Aperte F12 e olhe a aba Console."); }
    } catch (err) { alert("❌ Falha de conexão."); }
  };

  const carregarDashboard = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get('http://127.0.0.1:8000/api/dashboard/', { headers: { Authorization: `Bearer ${token}` } });
      setDados(res.data);
    } catch (err) { console.error(err); }
  };

  const salvarManual = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://127.0.0.1:8000/api/dashboard/', formManual, { headers: { Authorization: `Bearer ${token}` } });
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
      const res = await axios.post('http://127.0.0.1:8000/api/chat/', { mensagem: mensagemDigitada }, { headers: { Authorization: `Bearer ${token}` } });
      setMensagens(p => [...p, { remetente: 'mordomo', texto: res.data.resposta_mordomo }]);
      setMensagemDigitada('');
      carregarDashboard();
    } finally { setCarregando(false); }
  };

  const formatar = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  useEffect(() => {
    initParticlesEngine(async (engine) => { await loadSlim(engine); }).then(() => { setInit(true); });
  }, []);

  const configuracaoParticulas = useMemo(() => ({
    background: { color: { value: "#0A1118" } },
    fpsLimit: 60, interactivity: { events: { onHover: { enable: true, mode: "grab" } }, modes: { grab: { distance: 150, links: { opacity: 0.5 } } } },
    particles: { color: { value: "#00F0FF" }, links: { color: "#00F0FF", distance: 150, enable: true, opacity: 0.2, width: 1 }, move: { enable: true, speed: 0.8, outModes: { default: "bounce" } }, number: { density: { enable: true, area: 800 }, value: 120 }, opacity: { value: 0.5 }, shape: { type: "circle" }, size: { value: { min: 1, max: 3 } } },
    detectRetina: true,
  }), []);

  return (
    <div style={{ position: 'relative', display: 'flex', minHeight: '100vh', backgroundColor: '#0A1118', color: '#E2E8F0', fontFamily: '"Inter", sans-serif' }}>
      {init && <Particles id="tsparticles" options={configuracaoParticulas} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />}

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

        {/* --- MEUS BLOCOS FATIADOS E IMPORTADOS --- */}
        <CardsPrincipais dados={dados} formatar={formatar} />
        
        <FormulariosRendaDespesa 
          renda={renda} formatar={formatar} novaRendaInput={novaRendaInput} setNovaRendaInput={setNovaRendaInput} salvarNovaRenda={salvarNovaRenda}
          novaDespesa={novaDespesa} setNovaDespesa={setNovaDespesa} salvarNovaDespesa={salvarNovaDespesa} despesas={despesas}
        />

        {/* Linha 3: Transações e Gráfico de Distribuição */}
        <div style={{ display: 'flex', gap: '25px' }}>
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

        {/* Linha 4: Gráfico de Evolução */}
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

      {/* --- O CHAT FATIADO --- */}
      <ChatMordomo 
        mensagens={mensagens} mensagemDigitada={mensagemDigitada} 
        setMensagemDigitada={setMensagemDigitada} enviarChat={enviarChat} carregando={carregando} 
      />

    </div>
  );
}

export default PainelPrincipal;