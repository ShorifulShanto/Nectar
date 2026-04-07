
"use client";

import { useEffect, useState, useRef } from "react";
import { flavors } from "@/lib/flavor-data";
import { ChevronUp, ChevronDown, ShoppingBag, ArrowRight } from "lucide-react";
import { generateFlavorDescription } from "@/ai/flows/generate-flavor-description";
import Image from "next/image";

export function OlipopHero() {
  const [currentFlavorIndex, setCurrentFlavorIndex] = useState(0);
  const [isLoadingFlavor, setIsLoadingFlavor] = useState(false);
  const [aiDescription, setAiDescription] = useState<string>("");
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const currentFlavor = flavors[currentFlavorIndex];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const winHeight = window.innerHeight;
      setScrollProgress(Math.min(scrollPos / winHeight, 1));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <div 
        className="absolute inset-0 z-0 opacity-40 transition-all duration-1000"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${currentFlavor.hex} 0%, transparent 80%)` 
        }}
      />

      {/* Cinematic Video Sequence - No Static Image in Hero */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div 
          className={`relative w-full h-full transition-all duration-1000 ease-in-out transform ${isLoadingFlavor ? 'opacity-0 scale-110 blur-xl' : 'opacity-100 scale-100 blur-0'}`}
          style={{
            transform: `scale(${1 + scrollProgress * 0.2}) translateY(${scrollProgress * 50}px)`
          }}
        >
          <Image 
            src={currentFlavor.videoUrl} 
            alt={currentFlavor.name} 
            fill 
            className="object-contain md:object-cover drop-shadow-[0_0_100px_rgba(var(--primary),0.3)]"
            unoptimized
            priority
          />
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-20 min-h-screen w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-32 py-40">
        
        {/* Left: Branding & Story */}
        <div className={`w-full md:w-1/3 transition-all duration-700 ${isLoadingFlavor ? 'opacity-0 -translate-x-12' : 'opacity-100 translate-x-0'}`}>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="w-12 h-0.5 bg-primary" />
              <p className="text-primary font-bold tracking-[0.4em] uppercase text-[10px]">
                {currentFlavor.subtitle}
              </p>
            </div>
            <h1 className="text-7xl md:text-[10rem] font-headline font-bold uppercase leading-[0.7] tracking-tighter text-white">
              {currentFlavor.name}
            </h1>
            <div className="bg-white/5 backdrop-blur-md p-6 border-l-2 border-primary rounded-r-xl max-w-sm mt-8">
              <p className="text-base md:text-lg text-white/70 leading-relaxed font-body italic">
                {aiDescription || currentFlavor.description}
              </p>
            </div>
            <div className="pt-10">
              <button className="group flex items-center gap-4 px-8 py-4 bg-primary text-white font-bold rounded-full uppercase tracking-widest text-[11px] hover:scale-105 transition-all shadow-2xl shadow-primary/20 pointer-events-auto">
                <ShoppingBag size={18} />
                Try {currentFlavor.name} — $2.99
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Flavor Selector */}
        <div className="w-full md:w-auto mt-20 md:mt-0 flex md:flex-col items-center gap-10">
          <div className="flex md:flex-col items-center gap-6 p-3 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-2xl pointer-events-auto">
            <button 
              onClick={() => changeFlavor("prev")}
              className="p-4 rounded-full hover:bg-primary transition-all group bg-black/40 border border-white/5"
            >
              <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform text-white" />
            </button>
            
            <div className="flex md:flex-col gap-3 py-4">
              {flavors.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => {
                    if (i === currentFlavorIndex) return;
                    setIsLoadingFlavor(true);
                    setTimeout(() => setCurrentFlavorIndex(i), 400);
                    setTimeout(() => setIsLoadingFlavor(false), 800);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${i === currentFlavorIndex ? 'bg-primary scale-150 shadow-[0_0_15px_rgba(var(--primary),0.8)]' : 'bg-white/20 hover:bg-white/50'}`}
                />
              ))}
            </div>

            <button 
              onClick={() => changeFlavor("next")}
              className="p-4 rounded-full hover:bg-primary transition-all group bg-black/40 border border-white/5"
            >
              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform text-white" />
            </button>
          </div>
          
          <div className="hidden md:flex flex-col items-center gap-6">
             <span className="text-white/20 font-headline font-bold text-[9px] tracking-[0.6em] uppercase vertical-text">
               Explore Collection
             </span>
             <div className="w-px h-24 bg-gradient-to-b from-primary to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
