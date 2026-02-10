import React, { useState } from 'react';
import { Participant } from '../types';
import { PARTICIPANTS } from '../constants';
import { castVote } from '../services/votingService';
import CowIcon from './CowIcon';

interface Props {
  currentUser: Participant;
  onVoteCast: () => void;
}

const VoteCard: React.FC<Props> = ({ currentUser, onVoteCast }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Participant | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const candidates = PARTICIPANTS.filter(p => p.id !== currentUser.id);

  const handleVote = async () => {
    if (!selectedCandidate) return;
    
    setIsSubmitting(true);
    try {
      await castVote(currentUser.id, selectedCandidate.id);
      onVoteCast();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao votar');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modal de Confirmação
  if (selectedCandidate) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
        <div className="glass-panel rounded-3xl p-1 max-w-sm w-full relative overflow-hidden animate-float border-t border-white/30">
          <div className="bg-[#1a0b2e] rounded-[1.4rem] p-8 text-center relative">
             
             <button 
                onClick={() => setSelectedCandidate(null)}
                className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
             >
                <i className="fas fa-times text-xl"></i>
             </button>

             <h3 className="text-xl font-medium text-white/60 mb-6 uppercase tracking-wider">Voto para</h3>
             
             <div className="mb-8 relative inline-block">
                {/* Alterado de purple/pink para yellow/orange */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-50"></div>
                <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-br from-yellow-400 to-orange-500 relative z-10">
                    <img 
                        src={`https://ui-avatars.com/api/?name=${selectedCandidate.name}&background=1a0b2e&color=fff&size=256&bold=true`} 
                        className="w-full h-full rounded-full border-[6px] border-[#1a0b2e] object-cover" 
                        alt={selectedCandidate.name} 
                    />
                </div>
             </div>
             
             <h2 className="text-4xl font-bold text-white mb-8">{selectedCandidate.name}</h2>

             <button 
                onClick={handleVote}
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-lg shadow-green-900/50 active:scale-95 transition-all flex items-center justify-center text-lg tracking-wide group"
             >
                {isSubmitting ? (
                    <i className="fas fa-circle-notch fa-spin"></i>
                ) : (
                    <>CONFIRMAR VOTO <i className="fas fa-check ml-2 group-hover:scale-125 transition-transform"></i></>
                )}
             </button>
             
             <button 
                onClick={() => setSelectedCandidate(null)}
                className="mt-4 text-white/40 hover:text-white text-sm font-medium transition-colors"
             >
                Cancelar
             </button>
          </div>
        </div>
      </div>
    );
  }

  // Lista de Candidatos
  return (
    <div className="w-full max-w-7xl mx-auto pb-24">
      <div className="text-center mb-12 pt-8">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-white/80 text-sm font-medium">
                Logado como <strong className="text-yellow-400">{currentUser.name}</strong>
            </span>
        </div>
        
        <h2 className="text-4xl md:text-6xl text-white font-bold carnival-font leading-tight drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">
          Quem leva o <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 animate-pulse-glow">Ponta Firme?</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4">
        {candidates.map(candidate => (
          <button
            key={candidate.id}
            onClick={() => setSelectedCandidate(candidate)}
            className="group glass-card rounded-2xl p-4 flex flex-col items-center relative overflow-hidden"
          >
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="w-24 h-24 mb-4 relative z-10">
               <div className="absolute inset-0 bg-purple-500 blur-md opacity-20 group-hover:opacity-60 transition-opacity"></div>
               <img 
                 src={`https://ui-avatars.com/api/?name=${candidate.name}&background=2e1065&color=fff&size=128&bold=true`} 
                 alt={candidate.name}
                 className="w-full h-full rounded-full object-cover shadow-2xl border-2 border-white/10 group-hover:border-yellow-400/50 transition-colors" 
               />
            </div>
            
            <span className="font-bold text-white text-lg group-hover:text-yellow-300 transition-colors z-10">
              {candidate.name}
            </span>
            
            <div className="mt-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
                <span className="bg-yellow-400 text-purple-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Votar
                </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VoteCard;