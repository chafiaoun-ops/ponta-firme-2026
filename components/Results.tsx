import React, { useMemo } from 'react';
import { calculateResults } from '../services/votingService';
import { PARTICIPANTS } from '../constants';
import { Vote } from '../types';
import Confetti from './Confetti';

interface Props {
  results: Vote[];
}

const Results: React.FC<Props> = ({ results: votes }) => {
  const results = useMemo(() => calculateResults(votes), [votes]);

  const getParticipant = (id: string) => PARTICIPANTS.find(p => p.id === id);

  const winner = results[0] ? getParticipant(results[0].candidateId) : null;
  const second = results[1] ? getParticipant(results[1].candidateId) : null;
  const third = results[2] ? getParticipant(results[2].candidateId) : null;

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full animate-fade-in pb-20 pt-8">
      <Confetti />
      <div className="text-center mb-12">
         <div className="inline-block bg-gradient-to-r from-purple-900 to-pink-900 border border-white/20 px-6 py-2 rounded-full shadow-lg mb-4">
            <span className="text-yellow-400 font-bold uppercase tracking-[0.2em] text-xs">Resultado Oficial</span>
         </div>
         {/* Alterada a drop-shadow de Pink para Yellow */}
         <h2 className="text-5xl md:text-7xl text-white carnival-font drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
            Grandes Campeões
         </h2>
      </div>

      {/* PODIUM */}
      <div className="flex flex-col-reverse md:flex-row items-end justify-center gap-4 md:gap-0 w-full max-w-4xl mb-16 px-4">
        
        {/* 2nd Place */}
        <div className="flex flex-col items-center w-full md:w-1/3 order-1 md:order-1 relative z-10">
           <div className="mb-3 relative group">
             <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-slate-300 bg-[#0f0518] shadow-[0_0_20px_rgba(203,213,225,0.2)] overflow-hidden">
                 <img src={`https://ui-avatars.com/api/?name=${second?.name || '?'}&background=0f0518&color=cbd5e1&size=128&bold=true`} className="w-full h-full object-cover" />
             </div>
             <div className="absolute -top-3 -right-2 bg-slate-300 text-slate-900 font-black w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#0f0518] shadow-lg">2</div>
           </div>
           
           <div className="w-full bg-gradient-to-t from-slate-900/80 to-slate-800/80 backdrop-blur-md rounded-t-2xl p-4 flex flex-col items-center justify-start h-40 border-t-4 border-slate-400 relative shadow-2xl mx-1">
              <p className="font-bold text-xl md:text-2xl text-slate-200 mt-4">{second?.name || '-'}</p>
              <p className="text-slate-400 font-medium text-sm">{results[1]?.count || 0} votos</p>
           </div>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center w-full md:w-1/3 order-3 md:order-2 z-20 md:-mx-2 mb-8 md:mb-0">
           <div className="mb-4 relative animate-float">
             <div className="absolute -inset-4 bg-yellow-500 blur-2xl opacity-20 rounded-full"></div>
             <i className="fas fa-crown text-5xl text-yellow-400 absolute -top-10 left-1/2 transform -translate-x-1/2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"></i>
             <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-yellow-400 bg-[#0f0518] shadow-[0_0_30px_rgba(251,191,36,0.4)] overflow-hidden relative z-10">
                 <img src={`https://ui-avatars.com/api/?name=${winner?.name || '?'}&background=0f0518&color=fbbf24&size=160&bold=true`} className="w-full h-full object-cover" />
             </div>
           </div>
           
           <div className="w-full bg-gradient-to-t from-yellow-900/80 to-yellow-700/80 backdrop-blur-md rounded-t-3xl p-6 flex flex-col items-center justify-start h-56 border-t-4 border-yellow-400 relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <span className="bg-yellow-400 text-yellow-900 font-black px-3 py-1 rounded text-xs uppercase tracking-widest mb-2 shadow-sm">Ponta Firme</span>
              <p className="font-black text-3xl md:text-4xl text-white text-center leading-none mb-2">{winner?.name || '-'}</p>
              <p className="text-yellow-200 font-bold text-lg bg-black/20 px-4 py-1 rounded-full">{results[0]?.count || 0} votos</p>
           </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center w-full md:w-1/3 order-2 md:order-3 relative z-10">
           <div className="mb-3 relative">
             <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-amber-700 bg-[#0f0518] shadow-[0_0_20px_rgba(180,83,9,0.2)] overflow-hidden">
                 <img src={`https://ui-avatars.com/api/?name=${third?.name || '?'}&background=0f0518&color=b45309&size=128&bold=true`} className="w-full h-full object-cover" />
             </div>
             <div className="absolute -top-3 -left-2 bg-amber-700 text-amber-100 font-black w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#0f0518] shadow-lg">3</div>
           </div>
           
           <div className="w-full bg-gradient-to-t from-amber-900/80 to-amber-800/80 backdrop-blur-md rounded-t-2xl p-4 flex flex-col items-center justify-start h-32 border-t-4 border-amber-700 relative shadow-2xl mx-1">
              <p className="font-bold text-xl md:text-2xl text-amber-100 mt-4">{third?.name || '-'}</p>
              <p className="text-amber-300/80 font-medium text-sm">{results[2]?.count || 0} votos</p>
           </div>
        </div>

      </div>

      <div className="glass-panel p-8 rounded-3xl max-w-xl w-full">
         <h3 className="text-white/80 text-lg font-bold mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
            <i className="fas fa-list text-purple-400"></i> Classificação Geral
         </h3>
         <div className="space-y-2">
            {results.slice(3).map((r, idx) => {
               const p = getParticipant(r.candidateId);
               return (
                  <div key={r.candidateId} className="flex justify-between items-center text-white/80 bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-xl border border-white/5">
                     <div className="flex items-center gap-4">
                        <span className="font-bold text-white/30 text-sm">#{idx + 4}</span>
                        <span className="font-medium text-lg">{p?.name}</span>
                     </div>
                     <span className="font-bold text-white/40 bg-white/5 px-3 py-1 rounded-lg text-sm">{r.count}</span>
                  </div>
               )
            })}
         </div>
      </div>
    </div>
  );
};

export default Results;