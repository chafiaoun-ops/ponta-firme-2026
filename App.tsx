import React, { useEffect, useState } from 'react';
import { AppState, Participant, VotingStatus } from './types';
import { subscribeToData } from './services/votingService';
import { db } from './services/firebase';
import Login from './components/Login';
import VoteCard from './components/VoteCard';
import Results from './components/Results';
import AdminPanel from './components/AdminPanel';
import CowIcon from './components/CowIcon';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({ status: VotingStatus.WAITING, votes: [] });
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToData((newState) => {
      setAppState(newState);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const userVote = appState.votes.find(v => v.voterId === currentUser.id);
      setHasVoted(!!userVote);
    }
  }, [currentUser, appState.votes]);

  const handleLogin = (user: Participant) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setHasVoted(false);
  };

  return (
    <div className="bg-carnival flex flex-col font-sans min-h-screen">
      
      {/* Premium Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-40 p-4 flex justify-center pointer-events-none">
         <div className="glass-panel rounded-full px-6 py-3 flex items-center justify-between pointer-events-auto shadow-2xl max-w-4xl w-full">
            <div className="flex items-center gap-4">
                <div className="bg-yellow-400 rounded-full p-1.5 shadow-lg shadow-yellow-400/20">
                   <CowIcon className="w-8 h-8" emotion="wink" />
                </div>
                <div className="leading-tight flex flex-col justify-center">
                   <h1 className="text-white font-bold tracking-wide text-2xl md:text-3xl drop-shadow-md carnival-font">Ponta Firme</h1>
                   {/* Alterado de pink-400 para yellow-400 */}
                   <span className="text-xs text-yellow-400 font-bold uppercase tracking-[0.2em]">Carnaval 2026</span>
                </div>
            </div>
            
            {currentUser && (
              <button 
                onClick={handleLogout}
                className="text-white/60 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2"
              >
                <span>SAIR</span> <i className="fas fa-sign-out-alt"></i>
              </button>
            )}
         </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 pt-28">
        
        {/* -- RESULTADOS -- */}
        {appState.status === VotingStatus.CLOSED && (
           <Results results={appState.votes} />
        )}

        {/* -- AGUARDANDO -- */}
        {appState.status === VotingStatus.WAITING && (
           <div className="glass-panel p-10 rounded-[2rem] shadow-2xl max-w-md w-full mx-auto text-center animate-fade-in border-t border-white/20">
              <div className="mb-2 relative inline-block">
                 {/* Alterado de bg-pink-500 para bg-yellow-500 */}
                 <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
                 <CowIcon className="w-40 h-40 relative z-10 drop-shadow-2xl" emotion="happy" />
              </div>
              
              <h2 className="text-4xl carnival-font text-white mb-4">Segura a onda!</h2>
              <p className="text-white/70 font-medium text-lg leading-relaxed mb-2">
                A votação para o <strong className="text-yellow-400">Ponta Firme</strong> ainda não começou. Prepare-se!
              </p>
              
              <div className="pt-6 border-t border-white/10 mt-6">
                 <button onClick={() => setIsAdminOpen(true)} className="text-white/30 text-xs font-bold hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg transition-colors">
                    <i className="fas fa-lock mr-2"></i> Área do Administrador
                 </button>
              </div>
           </div>
        )}

        {/* -- VOTAÇÃO ABERTA -- */}
        {appState.status === VotingStatus.OPEN && (
           <>
              {!currentUser ? (
                 <Login onLogin={handleLogin} onAdminLogin={() => setIsAdminOpen(true)} />
              ) : (
                 hasVoted ? (
                    <div className="glass-panel p-10 rounded-[2.5rem] shadow-2xl max-w-sm mx-auto text-center animate-float border-t border-green-500/50 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
                       
                       <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                          <i className="fas fa-check text-4xl text-green-400"></i>
                       </div>
                       
                       <h2 className="text-3xl font-bold text-white mb-2">Voto Confirmado!</h2>
                       <p className="text-white/60 mb-8">
                         Valeu, <strong>{currentUser.name}</strong>! <br/>
                         Agora cruze os dedos.
                       </p>
                       
                       {/* Alterado de pink para yellow/orange */}
                       <button onClick={handleLogout} className="text-yellow-400 font-bold hover:text-yellow-300 text-sm tracking-wide uppercase border-b border-transparent hover:border-yellow-300 pb-1 transition-all">
                          Voltar ao início
                       </button>
                    </div>
                 ) : (
                    <VoteCard currentUser={currentUser} onVoteCast={() => {}} />
                 )
              )}
           </>
        )}
      </main>

      {/* Admin Panel */}
      {isAdminOpen && (
        <AdminPanel 
          currentStatus={appState.status} 
          voteCount={appState.votes.length}
          onClose={() => setIsAdminOpen(false)} 
        />
      )}
      
      {!db && (
        <div className="fixed bottom-4 right-4 bg-red-500/20 border border-red-500/50 backdrop-blur-md text-red-200 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg">
          <i className="fas fa-wifi-slash mr-1"></i> Modo Offline
        </div>
      )}
    </div>
  );
};

export default App;