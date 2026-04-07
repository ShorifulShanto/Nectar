
"use client";

import { useEffect, useState } from "react";

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center transition-opacity duration-1000">
      <div className="mb-8">
        <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter">
          OLIPOP<span className="text-primary">.</span>
        </h1>
      </div>
      <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="font-mono text-sm tracking-widest text-white/50">
        {progress}% LOADING ASSETS
      </p>
    </div>
  );
}
