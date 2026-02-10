import React, { useEffect, useState } from 'react';

const Confetti: React.FC = () => {
  const [particles, setParticles] = useState<Array<{id: number, left: string, animationDuration: string, color: string}>>([]);

  useEffect(() => {
    const colors = ['#FFC700', '#FF0000', '#2E3192', '#41B883', '#E91E63'];
    const newParticles = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100 + 'vw',
        animationDuration: (Math.random() * 3 + 2) + 's',
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map(p => (
        <div
          key={p.id}
          className="confetti"
          style={{
            left: p.left,
            animationDuration: p.animationDuration,
            backgroundColor: p.color
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;