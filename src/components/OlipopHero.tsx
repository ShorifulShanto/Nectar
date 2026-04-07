
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
      {/* Background Glow */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-20 transition-all duration-1000"
          style={{ 
            background: `radial-gradient(circle at 50% 50%, ${currentFlavor.hex} 0%, transparent 80%)` 
          }}
        />
        
        {/* Large Background Text */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <h2 className={`text-[25vw] font-headline font-bold uppercase text-white/[0.02] whitespace-nowrap transition-all duration-1000 transform ${isLoadingFlavor ? 'scale-110 opacity-0 blur-lg' : 'scale-100 opacity-100 blur-none'}`}>
            {currentFlavor.name}
          </h2>
        </div>

        {/* Hero Product */}
        <div className="relative w-full h-full flex items-center justify-center">
             <div className={`relative w-[280px] md:w-[500px] h-[500px] md:h-[800px] transition-all duration-1000 ease-in-out transform ${isLoadingFlavor ? 'scale-90 opacity-0 translate-y-20' : 'scale-100 opacity-100 translate-y-0'}`}>
                {currentFlavor.videoUrl ? (
                  <video 
                    key={currentFlavor.videoUrl}
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-contain drop-shadow-[0_45px_45px_rgba(0,0,0,0.7)]"
                  >
                    <source src={currentFlavor.videoUrl} type="video/webp" />
                  </video>
                ) : (
                  <Image 
                    src={currentFlavor.imageUrl || `https://picsum.photos/seed/${currentFlavor.sequenceId}/800/1200`}
                    alt={currentFlavor.name}
                    fill
                    className="object-contain drop-shadow-[0_60px_60px_rgba(0,0,0,0.8)]"
                    priority
                  />
                )}
             </div>
        </div>
      </div>

      {/* Interface Layer */}
      <div className="relative z-10 min-h-screen w-full flex flex-col md:flex-row items-center justify-between px-12 md:px-32 py-40 pointer-events-none">
        
        {/* Left: Info */}
        <div className={`w-full md:w-1/3 transition-all duration-700 pointer-events-auto ${isLoadingFlavor ? 'opacity-0 -translate-x-12' : 'opacity-100 translate-x-0'}`}>
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-12 h-0.5 bg-primary" />
              <p className="text-primary font-bold tracking-[0.4em] uppercase text-[11px]">
                {currentFlavor.subtitle}
              </p>
            </div>
            <h1 className="text-8xl md:text-[10rem] font-headline font-bold uppercase leading-[0.75] tracking-tighter text-white">
              {currentFlavor.name}
            </h1>
            <p className="text-xl md:text-2xl text-white/40 max-w-sm leading-relaxed font-body italic">
              {aiDescription || currentFlavor.description}
            </p>
            <div className="flex flex-wrap gap-5 pt-10">
              <button className="flex items-center gap-4 px-10 py-5 bg-primary text-white font-bold rounded-full uppercase tracking-widest text-[12px] hover:scale-105 transition-all shadow-2xl shadow-primary/30">
                <ShoppingBag size={18} />
                Add to cart — $2.99
              </button>
            </div>
          </div>
        </div>

        {/* Right: Flavor Controls */}
        <div className="w-full md:w-auto mt-20 md:mt-0 flex md:flex-col items-center gap-16 pointer-events-auto">
          <div className="flex md:flex-col items-center gap-8 p-3 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10">
            <button 
              onClick={() => changeFlavor("prev")}
              className="p-6 rounded-full hover:bg-primary transition-all group bg-black/40"
              aria-label="Previous Flavor"
            >
              <ChevronUp className="w-7 h-7 group-hover:-translate-y-1 transition-transform" />
            </button>
            <div className="hidden md:block w-10 h-px bg-white/10" />
            <button 
              onClick={() => changeFlavor("next")}
              className="p-6 rounded-full hover:bg-primary transition-all group bg-black/40"
              aria-label="Next Flavor"
            >
              <ChevronDown className="w-7 h-7 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
          
          <div className="hidden md:flex flex-col items-center gap-6">
             <span className="text-white/20 font-headline font-bold text-xs tracking-[0.5em] uppercase vertical-text">
               Discover More
             </span>
             <div className="w-px h-32 bg-gradient-to-b from-primary to-transparent" />
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none">
        {flavors.map((_, i) => (
          <div 
            key={i}
            className={`h-2 transition-all duration-700 rounded-full ${i === currentFlavorIndex ? 'w-16 bg-primary shadow-[0_0_20px_rgba(var(--primary),0.6)]' : 'w-4 bg-white/10'}`}
          />
        ))}
      </div>
    </section>
  );
}
