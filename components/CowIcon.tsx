import React, { useEffect, useRef, useState } from 'react';

// URL alternativa do Google (lh3)
const COW_IMAGE_URL = "https://lh3.googleusercontent.com/d/13Q_W1TrD0k9BsmjcJaXJAyt70_Qqv_su";

const CowIcon: React.FC<{ className?: string, emotion?: 'happy' | 'neutral' | 'wink' }> = ({ className = "w-24 h-24", emotion }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    // Importante para permitir manipulação de pixels de outro domínio
    img.crossOrigin = "Anonymous"; 
    img.src = COW_IMAGE_URL;

    img.onload = () => {
      // Ajusta tamanho do canvas
      canvas.width = img.width;
      canvas.height = img.height;

      // Desenha imagem original
      ctx.drawImage(img, 0, 0);

      try {
        // Pega os dados de todos os pixels
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = frame.data;
        const length = data.length;

        // Limiar de escuridão (0 a 255). 
        // REDUZIDO DRASTICAMENTE PARA 5 PARA PRESERVAR DETALHES ESCUROS DA VAQUINHA
        // Isso assume que o fundo é "Preto Absoluto" (0,0,0) ou muito próximo disso.
        const THRESHOLD = 5; 

        for (let i = 0; i < length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Se R, G e B forem menores que o limiar (muito escuro)
          if (r < THRESHOLD && g < THRESHOLD && b < THRESHOLD) {
            data[i + 3] = 0; // Define Alpha como 0 (Transparente)
          }
        }

        // Coloca a imagem processada de volta no canvas
        ctx.putImageData(frame, 0, 0);
        setIsLoaded(true);
      } catch (e) {
        console.warn("Não foi possível remover o fundo (CORS block). Mostrando imagem original.", e);
        // Se der erro de segurança (CORS), mostra a imagem mesmo com fundo preto
        setIsLoaded(true); 
      }
    };

    img.onerror = () => {
      console.error("Erro ao carregar imagem da vaquinha");
      setHasError(true);
    };

  }, []);

  // Adicionada a classe 'animate-float' para o efeito flutuante solicitado
  return (
    <div className={`${className} flex items-center justify-center relative animate-float`}>
      {!hasError ? (
        <canvas 
          ref={canvasRef}
          className={`w-full h-full object-contain drop-shadow-lg ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        />
      ) : (
        /* Fallback: Se a imagem falhar totalmente, mostra emoji */
        <div className="flex flex-col items-center justify-center text-center animate-bounce">
           <span className="text-5xl drop-shadow-md">🐮</span>
        </div>
      )}
    </div>
  );
};

export default CowIcon;