import React, { useState } from 'react';
import { Participant } from '../types';
import { PARTICIPANTS } from '../constants';
import { castVote } from '../services/votingService';

interface Props {
  currentUser: Participant;
  onVoteCast: () => void;
}

const VotingPanel: React.FC<Props> = ({ currentUser, onVoteCast }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Participant | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter out the current user (cannot vote for self)
  const candidates = PARTICIPANTS.filter(p => p.id !== currentUser.id);

  const handleVote = async () => {
    if (!selectedCandidate) return;
    
    setIsSubmitting(true);
    try {
      // Simulate network delay for effect
      await new Promise(resolve => setTimeout(resolve, 800));
      castVote(currentUser.id, selectedCandidate.id);
      onVoteCast();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao votar');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (selectedCandidate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Confirmar Voto?</h3>
          
          <div className="mb-8 flex flex-col items-center">
            <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mb-4 border-4 border-yellow-400">
               <span className="text-5xl">🐮</span>
            </div>
            <p className="text-lg text-gray-600">Você está votando em:</p>
            <p className="text-3xl font-extrabold text-purple-600 mt-2">{selectedCandidate.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <button 
                onClick={() => setSelectedCandidate(null)}
                className="py-3 px-6 rounded-lg font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
                disabled={isSubmitting}
             >
               Cancelar
             </button>
             <button 
                onClick={handleVote}
                className="py-3 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 shadow-lg transform active:scale-95 transition-all flex items-center justify-center"
                disabled={isSubmitting}
             >
               {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : 'CONFIRMAR'}
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h2 className="text-2xl md:text-3xl text-white font-bold text-center mb-6 drop-shadow-md">
        Quem merece o troféu <span className="text-yellow-300 carnival-font">Ponta Firme</span>?
      </h2>
      <p className="text-center text-white/90 mb-8 max-w-xl mx-auto">
        Escolha abaixo quem você acha que mais representou a turma neste Carnaval!
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {candidates.map(candidate => (
          <button
            key={candidate.id}
            onClick={() => setSelectedCandidate(candidate)}
            className="group relative bg-white bg-opacity-90 hover:bg-opacity-100 rounded-xl p-4 flex flex-col items-center shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl hover:ring-4 hover:ring-purple-400 focus:outline-none"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-3 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
               {/* Use first letter as fallback avatar */}
               <span className="font-bold text-purple-500">{candidate.name.charAt(0)}</span>
            </div>
            <span className="font-bold text-gray-800 text-lg group-hover:text-purple-600 leading-tight">
              {candidate.name}
            </span>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <i className="fas fa-check-circle text-green-500 text-xl"></i>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VotingPanel;