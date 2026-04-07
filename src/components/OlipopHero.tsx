"use client";

import { useEffect, useState, useMemo } from "react";
import { flavors } from "@/lib/flavor-data";
import { ChevronUp, ChevronDown, ShoppingBag, ArrowRight } from "lucide-react";
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
    
    // Smooth transition delay
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
      className="relative min-h-screen w-full overflow-hidden bg-black transition-colors duration-1000"
      style={dynamicStyles}
    >
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-10 transition-all duration-1000"
          style={{ 
            background: `radial-gradient(circle at 50% 50%, ${currentFlavor.hex} 0%, transparent 70%)` 
          }}
        />
        
        {/* Large Background Text */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <h2 className={`text-[20vw] font-headline font-bold uppercase text-white/[0.03] whitespace-nowrap transition-all duration-1000 transform ${isLoadingFlavor ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
            {currentFlavor.name}
          </h2>
        </div>

        {/* Centered Product (Video or Image) */}
        <div className="relative w-full h-full flex items-center justify-center">
             <div className={`relative w-[320px] md:w-[650px] h-[500px] md:h-[900px] transition-all duration-1000 ease-in-out transform ${isLoadingFlavor ? 'scale-75 opacity-0 -translate-y-20 rotate-12' : 'scale-100 opacity-100 translate-y-0 rotate-0'}`}>
                {currentFlavor.videoUrl ? (
                  <video 
                    key={currentFlavor.videoUrl}
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)]"
                  >
                    <source src={currentFlavor.videoUrl} type="video/webp" />
                    <source src={currentFlavor.videoUrl.replace('.webp', '.mp4')} type="video/mp4" />
                  </video>
                ) : (
                  <Image 
                    src={`https://picsum.photos/seed/${currentFlavor.sequenceId}/800/1200`}
                    alt={currentFlavor.name}
                    fill
                    className="object-contain drop-shadow-[0_45px_45px_rgba(0,0,0,0.8)]"
                    priority
                  />
                )}
             </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="relative z-10 min-h-screen w-full flex flex-col md:flex-row items-center justify-between px-8 md:px-24 py-32 pointer-events-none">
        
        {/* Left Content: Description & CTA */}
        <div className={`w-full md:w-1/3 transition-all duration-700 pointer-events-auto ${isLoadingFlavor ? 'opacity-0 -translate-x-12' : 'opacity-100 translate-x-0'}`}>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-0.5 bg-primary" />
              <p className="text-primary font-bold tracking-[0.3em] uppercase text-[10px]">
                {currentFlavor.subtitle}
              </p>
            </div>
            <h1 className="text-7xl md:text-9xl font-headline font-bold uppercase leading-[0.8] tracking-tighter text-white">
              {currentFlavor.name}
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-sm leading-relaxed font-body italic">
              {aiDescription || currentFlavor.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-6">
              <button className="flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-full uppercase tracking-widest text-[11px] hover:scale-105 transition-transform shadow-xl shadow-primary/20">
                <ShoppingBag size={16} />
                Add to cart — $2.99
              </button>
              <button className="px-8 py-4 border border-white/10 text-white/80 font-bold rounded-full uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Right Navigation: Flavor Selector */}
        <div className="w-full md:w-auto mt-12 md:mt-0 flex md:flex-col items-center gap-12 pointer-events-auto">
          <div className="flex md:flex-col items-center gap-6 p-2 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10">
            <button 
              onClick={() => changeFlavor("prev")}
              className="p-5 rounded-full hover:bg-primary transition-all group bg-black/20"
              aria-label="Previous Flavor"
            >
              <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
            </button>
            <div className="hidden md:block w-8 h-px bg-white/10" />
            <button 
              onClick={() => changeFlavor("next")}
              className="p-5 rounded-full hover:bg-primary transition-all group bg-black/20"
              aria-label="Next Flavor"
            >
              <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
          
          <div className="hidden md:flex flex-col items-center gap-4">
             <span className="text-white/20 font-headline font-bold text-sm tracking-widest uppercase vertical-text">
               Explore Flavors
             </span>
             <div className="w-px h-24 bg-gradient-to-b from-primary to-transparent" />
          </div>
        </div>
      </div>

      {/* Bottom Progress Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-none">
        {flavors.map((_, i) => (
          <div 
            key={i}
            className={`h-1.5 transition-all duration-500 rounded-full ${i === currentFlavorIndex ? 'w-12 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]' : 'w-4 bg-white/10'}`}
          />
        ))}
      </div>
    </section>
  );
}
