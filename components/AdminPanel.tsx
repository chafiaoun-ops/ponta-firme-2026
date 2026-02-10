import React, { useState } from 'react';
import { VotingStatus } from '../types';
import { updateStatus, resetElection } from '../services/votingService';
import { ADMIN_PASSWORD } from '../constants';

interface Props {
  currentStatus: VotingStatus;
  voteCount: number;
  onClose: () => void;
}

const AdminPanel: React.FC<Props> = ({ currentStatus, voteCount, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Senha incorreta!');
      setPasswordInput('');
    }
  };
  
  const handleReset = () => {
    if (confirm('ATENÇÃO: Isso apagará o histórico local ou exigirá limpeza manual no Firebase. Continuar?')) {
      resetElection();
      alert('Comando enviado.');
    }
  };

  const handleOpen = () => updateStatus(VotingStatus.OPEN);
  const handleCloseVoting = () => {
    if (confirm('Encerrar votação e mostrar resultados?')) updateStatus(VotingStatus.CLOSED);
  };
  const handleStop = () => updateStatus(VotingStatus.WAITING);

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-[#0f0518]/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
        <div className="glass-panel rounded-2xl w-full max-w-sm p-8 shadow-2xl border border-white/10">
             <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
                <i className="fas fa-times text-xl"></i>
             </button>
             
             <div className="text-center mb-8">
                <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <i className="fas fa-shield-alt text-2xl text-purple-400"></i>
                </div>
                <h2 className="text-xl font-bold text-white">Acesso Restrito</h2>
             </div>

             <form onSubmit={handleLogin} className="space-y-4">
                <input 
                  type="password" 
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-center text-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Senha"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  autoFocus
                />
                {error && <div className="text-red-400 text-sm text-center font-medium">{error}</div>}
                <button type="submit" className="w-full bg-white text-purple-900 font-bold py-4 rounded-xl hover:bg-gray-100 transition-colors">ENTRAR</button>
             </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0f0518]/95 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#1a0b2e] rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-white/10 relative">
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <h2 className="text-2xl font-bold text-white">Painel de Controle</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-2">Status</p>
              <p className={`text-xl font-black ${currentStatus === VotingStatus.OPEN ? 'text-green-400' : currentStatus === VotingStatus.CLOSED ? 'text-red-400' : 'text-yellow-400'}`}>
                {currentStatus === VotingStatus.WAITING && 'AGUARDANDO'}
                {currentStatus === VotingStatus.OPEN && 'ABERTA'}
                {currentStatus === VotingStatus.CLOSED && 'ENCERRADA'}
              </p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-right">
              <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-2">Votos</p>
              <p className="font-black text-3xl text-white">{voteCount}</p>
          </div>
        </div>

        <div className="space-y-3">
          {currentStatus === VotingStatus.WAITING && (
            <button onClick={handleOpen} className="w-full py-5 bg-green-500 hover:bg-green-400 text-[#0f0518] font-black rounded-xl text-lg flex items-center justify-center gap-2 transition-colors">
              <i className="fas fa-play"></i> INICIAR VOTAÇÃO
            </button>
          )}

          {currentStatus === VotingStatus.OPEN && (
            <>
              <button onClick={handleCloseVoting} className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black rounded-xl text-lg flex items-center justify-center gap-2 transition-all">
                <i className="fas fa-trophy"></i> ENCERRAR E PREMIAR
              </button>
              <button onClick={handleStop} className="w-full py-4 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                <i className="fas fa-pause"></i> Pausar
              </button>
            </>
          )}

          {currentStatus === VotingStatus.CLOSED && (
            <button onClick={handleStop} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                <i className="fas fa-undo"></i> Ocultar Resultados
            </button>
          )}

          <div className="pt-6 mt-6 border-t border-white/5">
             <button onClick={handleReset} className="w-full py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
              <i className="fas fa-trash-alt"></i> ZERAR DADOS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;