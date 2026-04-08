
"use client";

import { useEffect, useState } from "react";

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center transition-opacity duration-1000">
      <div className="mb-12 text-center">
        <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-[0.3em] text-white animate-pulse">
          OLIPOP
        </h1>
        <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 mt-4">
          Fresh Cold-Pressed Juice
        </p>
      </div>
      <div className="w-80 h-0.5 bg-white/10 rounded-full overflow-hidden mb-6">
        <div 
          className="h-full bg-white transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="font-mono text-[10px] tracking-[0.3em] text-white/20">
        LOADING {progress}%
      </p>
    </div>
  );
}
