
"use client";

import { useEffect, useState } from "react";
import { flavors } from "@/lib/flavor-data";
import { ChevronUp, ChevronDown, ShoppingBag } from "lucide-react";
import { generateFlavorDescription } from "@/ai/flows/generate-flavor-description";
import Image from "next/image";

export function OlipopHero() {
  const [currentFlavorIndex, setCurrentFlavorIndex] = useState(0);
  const [isLoadingFlavor, setIsLoadingFlavor] = useState(false);
  const [aiDescription, setAiDescription] = useState<string>("");
  
  const currentFlavor = flavors[currentFlavorIndex];

  const changeFlavor = async (dir: "next" | "prev") => {
    setIsLoadingFlavor(true);
    let nextIdx = currentFlavorIndex;
    if (dir === "next") nextIdx = (currentFlavorIndex + 1) % flavors.length;
    else nextIdx = (currentFlavorIndex - 1 + flavors.length) % flavors.length;
    
    setTimeout(() => {
      setCurrentFlavorIndex(nextIdx);
    }, 400);

    try {
      const result = await generateFlavorDescription({
        flavorName: flavors[nextIdx].name,
        flavorColor: flavors[nextIdx].color
      });
      setAiDescription(result.description);
    } catch (e) {
      setAiDescription("");
    }

    setTimeout(() => {
      setIsLoadingFlavor(false);
    }, 800);
  };

  const hexToHsl = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const dynamicStyles = {
    '--primary': hexToHsl(currentFlavor.hex),
    '--accent': hexToHsl(currentFlavor.accentHex),
    '--current-hex': currentFlavor.hex,
  } as React.CSSProperties;

  return (
    <section 
      id="product" 
      className="relative min-h-screen w-full overflow-hidden bg-black transition-all duration-1000"
      style={dynamicStyles}
    >
      {/* Background Layer: WebP Sequence */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-40 transition-all duration-1000"
          style={{ 
            background: `radial-gradient(circle at 50% 50%, ${currentFlavor.hex} 0%, transparent 80%)` 
          }}
        />
        
        {/* Cinematic WebP Sequence Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`relative w-full h-full transition-all duration-1000 opacity-30 blur-sm ${isLoadingFlavor ? 'scale-110' : 'scale-100'}`}>
            {currentFlavor.videoUrl && (
              <Image 
                src={currentFlavor.videoUrl} 
                alt="Sequence Background" 
                fill 
                className="object-cover"
                unoptimized
              />
            )}
          </div>
        </div>

        {/* Hero Product Center */}
        <div className="relative w-full h-full flex items-center justify-center z-20">
             <div className={`relative w-[320px] md:w-[600px] h-[500px] md:h-[800px] transition-all duration-1000 ease-in-out transform ${isLoadingFlavor ? 'scale-90 opacity-0 translate-y-20 rotate-12' : 'scale-100 opacity-100 translate-y-0 rotate-0'}`}>
                {currentFlavor.imageUrl ? (
                  <Image 
                    src={currentFlavor.imageUrl}
                    alt={currentFlavor.name}
                    fill
                    className="object-contain drop-shadow-[0_80px_80px_rgba(0,0,0,0.9)]"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 animate-pulse rounded-3xl" />
                )}
             </div>
        </div>
      </div>

      {/* Interface Layer */}
      <div className="relative z-30 min-h-screen w-full flex flex-col md:flex-row items-center justify-between px-12 md:px-32 py-40 pointer-events-none">
        
        {/* Left: Content */}
        <div className={`w-full md:w-1/3 transition-all duration-700 pointer-events-auto ${isLoadingFlavor ? 'opacity-0 -translate-x-12' : 'opacity-100 translate-x-0'}`}>
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-12 h-0.5 bg-primary" />
              <p className="text-primary font-bold tracking-[0.4em] uppercase text-[11px]">
                {currentFlavor.subtitle}
              </p>
            </div>
            <h1 className="text-8xl md:text-[12rem] font-headline font-bold uppercase leading-[0.7] tracking-tighter text-white">
              {currentFlavor.name}
            </h1>
            <div className="bg-white/5 backdrop-blur-md p-6 border-l-2 border-primary rounded-r-xl max-w-sm mt-8">
              <p className="text-lg md:text-xl text-white/70 leading-relaxed font-body italic">
                {aiDescription || currentFlavor.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-5 pt-10">
              <button className="flex items-center gap-4 px-10 py-5 bg-primary text-white font-bold rounded-full uppercase tracking-widest text-[12px] hover:scale-105 transition-all shadow-2xl shadow-primary/30">
                <ShoppingBag size={18} />
                Add to cart — $2.99
              </button>
            </div>
          </div>
        </div>

        {/* Right: Navigation Controls */}
        <div className="w-full md:w-auto mt-20 md:mt-0 flex md:flex-col items-center gap-16 pointer-events-auto">
          <div className="flex md:flex-col items-center gap-6 p-4 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl">
            <button 
              onClick={() => changeFlavor("prev")}
              className="p-5 rounded-full hover:bg-primary transition-all group bg-black/40 border border-white/5"
              aria-label="Previous Flavor"
            >
              <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
            </button>
            
            <div className="flex md:flex-col gap-3 py-4">
              {flavors.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setIsLoadingFlavor(true);
                    setTimeout(() => setCurrentFlavorIndex(i), 400);
                    setTimeout(() => setIsLoadingFlavor(false), 800);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${i === currentFlavorIndex ? 'bg-primary scale-150 shadow-[0_0_15px_rgba(var(--primary),0.8)]' : 'bg-white/20 hover:bg-white/50'}`}
                />
              ))}
            </div>

            <button 
              onClick={() => changeFlavor("next")}
              className="p-5 rounded-full hover:bg-primary transition-all group bg-black/40 border border-white/5"
              aria-label="Next Flavor"
            >
              <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
          
          <div className="hidden md:flex flex-col items-center gap-6">
             <span className="text-white/20 font-headline font-bold text-[10px] tracking-[0.6em] uppercase vertical-text">
               Discover More
             </span>
             <div className="w-px h-32 bg-gradient-to-b from-primary to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
