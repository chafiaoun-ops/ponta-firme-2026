import React, { useState } from 'react';
import { PARTICIPANTS } from '../constants';
import { Participant } from '../types';
import CowIcon from './CowIcon';

interface Props {
  onLogin: (participant: Participant) => void;
  onAdminLogin: () => void;
}

const Login: React.FC<Props> = ({ onLogin, onAdminLogin }) => {
  const [nameSearch, setNameSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<Participant | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const filteredUsers = nameSearch.length > 0 
    ? PARTICIPANTS.filter(p => p.name.toLowerCase().includes(nameSearch.toLowerCase()))
    : [];

  const handleUserSelect = (p: Participant) => {
    setSelectedUser(p);
    setNameSearch('');
    setCode('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code === 'ADMIN') {
        onAdminLogin();
        return;
    }

    if (!selectedUser) {
        if(code === '1508') {
             onAdminLogin();
             return;
        }
        setError('Ops! Selecione seu nome primeiro.');
        return;
    }

    if (code === selectedUser.code) {
      onLogin(selectedUser);
    } else {
      setError('Código incorreto!');
    }
  };

  return (
    <div className="glass-panel p-8 rounded-[2rem] max-w-sm w-full animate-fade-in relative mx-4 mt-8 border-t border-white/20">
      
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
         <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-40 rounded-full animate-pulse"></div>
            <CowIcon emotion="happy" className="w-32 h-32 drop-shadow-2xl relative z-10" />
         </div>
      </div>
      
      <div className="mt-14 text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-1">Identificação</h2>
        <p className="text-white/60 text-sm">Acesso exclusivo para convidados</p>
      </div>

      {!selectedUser ? (
        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-search text-white/40 group-focus-within:text-yellow-400 transition-colors"></i>
            </div>
            <input
              type="text"
              placeholder="Busque seu nome..."
              className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400/50 focus:bg-white/10 focus:ring-0 transition-all text-white placeholder-white/30 outline-none font-medium"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
            />
          </div>

          {nameSearch.length > 0 && (
            <div className="bg-[#1e0b36] border border-white/10 rounded-xl max-h-60 overflow-y-auto shadow-2xl z-20 absolute w-full left-0 mt-2 p-1">
              {filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-white/40">Nome não encontrado</div>
              ) : (
                filteredUsers.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleUserSelect(p)}
                    className="w-full text-left px-4 py-3 hover:bg-white/10 rounded-lg text-white/90 flex items-center justify-between transition-colors group"
                  >
                    <span className="font-bold">{p.name}</span>
                    <i className="fas fa-chevron-right text-white/20 group-hover:text-yellow-400 text-xs"></i>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between bg-white/5 p-2 pr-4 rounded-full border border-white/10">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg">
                    {selectedUser.name.charAt(0)}
                </div>
                <span className="font-bold text-white text-lg">{selectedUser.name}</span>
             </div>
             <button 
                type="button" 
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500/20 text-white/50 hover:text-red-400 flex items-center justify-center transition-colors"
             >
                <i className="fas fa-times"></i>
             </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-yellow-400/80 font-bold uppercase tracking-widest mb-3">Senha de Acesso</p>
            <div className="relative">
                <input
                type="tel"
                maxLength={4}
                className="w-full py-4 bg-transparent border-b-2 border-white/20 focus:border-yellow-400 text-center text-4xl font-bold text-white tracking-[0.5em] placeholder-white/10 outline-none transition-all"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                autoFocus
                />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 text-red-200 rounded-lg text-sm text-center animate-pulse">
              <i className="fas fa-exclamation-circle mr-2"></i>{error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/50 transform transition active:scale-[0.98] flex items-center justify-center gap-2 text-lg"
          >
            <span>CONFIRMAR</span>
            <i className="fas fa-arrow-right"></i>
          </button>
        </form>
      )}
      
      <div className="mt-8 text-center">
         <button onClick={onAdminLogin} className="text-xs font-medium text-white/20 hover:text-white/50 transition-colors uppercase tracking-wider">
            Admin
         </button>
      </div>
    </div>
  );
};

export default Login;