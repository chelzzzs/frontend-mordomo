import React from 'react';

const glassCardStyle = { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.15)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' };

const Card = ({ titulo, valor, cor }) => (
  <div style={glassCardStyle}>
    <p style={{ margin: 0, color: '#94A3B8', fontSize: '12px', fontWeight: '800', letterSpacing: '1px' }}>{titulo}</p>
    <h2 style={{ margin: '10px 0 0 0', color: cor, fontSize: '32px', textShadow: `0 0 20px ${cor}40` }}>{valor}</h2>
  </div>
);

function CardsPrincipais({ dados, formatar }) {
  return (
    <div style={{ display: 'flex', gap: '25px' }}>
      <Card titulo="SALDO ATUAL" valor={formatar(dados.saldo_atual)} cor="#00F0FF" />
      <Card titulo="ENTRADAS (MÊS)" valor={formatar(dados.total_receitas)} cor="#00FA9A" />
      <Card titulo="SAÍDAS (MÊS)" valor={formatar(dados.total_despesas)} cor="#FF007F" />
    </div>
  );
}

export default CardsPrincipais;