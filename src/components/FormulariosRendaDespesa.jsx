import React from 'react';

// Estilos isolados
const glassCardStyle = { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.15)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' };
const cardTitleStyle = { margin: '0 0 20px 0', color: '#94A3B8', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' };
const inputStyle = { padding: '14px', borderRadius: '10px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#E2E8F0', fontSize: '14px', outline: 'none', transition: '0.3s' };
const btnNeonStyle = { padding: '14px 25px', backgroundColor: 'transparent', color: '#00F0FF', border: '1px solid #00F0FF', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)', textTransform: 'uppercase', letterSpacing: '1px' };

function FormulariosRendaDespesa({ 
    renda, formatar, novaRendaInput, setNovaRendaInput, salvarNovaRenda,
    novaDespesa, setNovaDespesa, salvarNovaDespesa, despesas 
}) {
  return (
    <div style={{ display: 'flex', gap: '25px' }}>
      <div style={glassCardStyle}>
        <h3 style={cardTitleStyle}>💰 Minha Renda Mensal</h3>
        <h2 style={{ color: '#00F0FF', margin: '10px 0 20px 0', textShadow: '0 0 20px #00F0FF40' }}>{formatar(renda)}</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="number" placeholder="Atualizar renda..." style={{...inputStyle, flex: 1}} value={novaRendaInput} onChange={(e) => setNovaRendaInput(e.target.value)} />
          <button style={btnNeonStyle} onClick={salvarNovaRenda}>Salvar</button>
        </div>
      </div>

      <div style={{ ...glassCardStyle, flex: 2 }}>
        <h3 style={cardTitleStyle}>📌 Adicionar Despesa Fixa / Parcelada</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input type="text" placeholder="Nome (ex: Luz, Carro)" style={{...inputStyle, flex: 1}} value={novaDespesa.descricao} onChange={(e) => setNovaDespesa({...novaDespesa, descricao: e.target.value})} />
          <input type="number" placeholder="Valor (R$)" style={{...inputStyle, width: '120px'}} value={novaDespesa.valor} onChange={(e) => setNovaDespesa({...novaDespesa, valor: e.target.value})} />
          <input type="number" placeholder="Parcelas (Vazio = Fixa)" style={{...inputStyle, flex: 1}} value={novaDespesa.parcelas_totais} onChange={(e) => setNovaDespesa({...novaDespesa, parcelas_totais: e.target.value})} />
          <button style={btnNeonStyle} onClick={salvarNovaDespesa}>Adicionar</button>
        </div>
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px', overflowY: 'auto' }}>
          {despesas.map(d => (
            <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: '8px', borderLeft: '4px solid #FF007F' }}>
              <span style={{ fontSize: '14px' }}>
                {d.descricao} <span style={{ color: '#94A3B8', fontSize: '12px' }}>{d.parcelas_totais ? `(${d.parcelas_pagas}/${d.parcelas_totais})` : '(Fixa)'}</span>
              </span>
              <span style={{ fontWeight: 'bold', color: '#E2E8F0', fontSize: '14px' }}>{formatar(d.valor)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FormulariosRendaDespesa;