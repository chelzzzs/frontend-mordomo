import React from 'react';

// Estilos isolados para o Chat
const inputStyle = { padding: '14px', borderRadius: '10px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#E2E8F0', fontSize: '14px', outline: 'none', transition: '0.3s' };
const btnNeonStyle = { padding: '14px 25px', backgroundColor: 'transparent', color: '#00F0FF', border: '1px solid #00F0FF', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)', textTransform: 'uppercase', letterSpacing: '1px' };

function ChatMordomo({ mensagens, mensagemDigitada, setMensagemDigitada, enviarChat, carregando }) {
  return (
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
              padding: '14px 18px', borderRadius: '16px', maxWidth: '85%',
              borderBottomRightRadius: m.remetente === 'usuario' ? '4px' : '16px',
              borderBottomLeftRadius: m.remetente === 'mordomo' ? '4px' : '16px',
            }}>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>{m.texto}</p>
            </div>
          ))}
        </div>
        <form onSubmit={enviarChat} style={{ padding: '20px', display: 'flex', gap: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <input type="text" value={mensagemDigitada} onChange={e => setMensagemDigitada(e.target.value)} placeholder="Digite seu comando..." disabled={carregando} style={{ ...inputStyle, flex: 1 }} />
          <button type="submit" disabled={carregando} style={btnNeonStyle}>Ir</button>
        </form>
      </div>
    </div>
  );
}

export default ChatMordomo;