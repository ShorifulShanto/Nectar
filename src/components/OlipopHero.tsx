
"use client";

import { useEffect, useState, useMemo } from "react";
import { flavors } from "@/lib/flavor-data";
import { ChevronUp, ChevronDown, Instagram, Facebook, Twitter, ShoppingBag } from "lucide-react";
import { generateFlavorDescription } from "@/ai/flows/generate-flavor-description";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

export function OlipopHero() {
  const [currentFlavorIndex, setCurrentFlavorIndex] = useState(0);
  const [isLoadingFlavor, setIsLoadingFlavor] = useState(false);
  const [aiDescription, setAiDescription] = useState<string>("");
  
  const currentFlavor = flavors[currentFlavorIndex];
  
  const currentPlaceholder = useMemo(() => {
    return PlaceHolderImages.find(img => img.id === currentFlavor.sequenceId);
  }, [currentFlavor.sequenceId]);

  const changeFlavor = async (dir: "next" | "prev") => {
    setIsLoadingFlavor(true);
    let nextIdx = currentFlavorIndex;
    if (dir === "next") nextIdx = (currentFlavorIndex + 1) % flavors.length;
    else nextIdx = (currentFlavorIndex - 1 + flavors.length) % flavors.length;
    
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
      setCurrentFlavorIndex(nextIdx);
      setIsLoadingFlavor(false);
    }, 400);
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
          className="absolute inset-0 opacity-20 transition-all duration-1000"
          style={{ 
            background: `radial-gradient(circle at 50% 50%, ${currentFlavor.hex}66 0%, transparent 60%)` 
          }}
        />
        
        <div className="relative w-full h-full flex items-center justify-center">
             {currentPlaceholder && (
               <div className={`relative w-[300px] md:w-[600px] h-[400px] md:h-[800px] transition-all duration-1000 ease-in-out transform ${isLoadingFlavor ? 'scale-75 opacity-0 -translate-y-20' : 'scale-100 opacity-100 translate-y-0'}`}>
                 <Image 
                   src={currentPlaceholder.imageUrl}
                   alt={currentPlaceholder.description}
                   fill
                   className="object-contain drop-shadow-[0_45px_45px_rgba(0,0,0,0.8)]"
                   priority
                   data-ai-hint={currentPlaceholder.imageHint}
                 />
               </div>
             )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* Content Layout */}
      <div className="relative z-10 h-screen w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-24 py-32 pointer-events-none">
        
        {/* Left Content */}
        <div className={`w-full md:w-1/3 transition-all duration-700 pointer-events-auto ${isLoadingFlavor ? 'opacity-0 -translate-x-10' : 'opacity-100 translate-x-0'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-12 bg-primary" />
            <p className="text-primary font-bold tracking-[0.4em] uppercase text-xs">
              {currentFlavor.subtitle}
            </p>
          </div>
          <h1 className="text-6xl md:text-9xl font-headline font-bold uppercase leading-[0.85] mb-8 tracking-tighter">
            {currentFlavor.name}
          </h1>
          <p className="text-base md:text-lg text-white/60 mb-10 max-w-sm leading-relaxed font-body">
            {aiDescription || currentFlavor.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white font-bold hover:brightness-110 transition-all rounded-full uppercase tracking-widest text-[10px] group">
              <ShoppingBag size={14} className="group-hover:scale-110 transition-transform" />
              Add to cart
            </button>
            <button className="px-10 py-5 border border-white/20 text-white font-bold hover:bg-white hover:text-black transition-all rounded-full uppercase tracking-widest text-[10px]">
              Discovery kit
            </button>
          </div>
        </div>

        {/* Center Space Reserved for Bottle (Handled by Background Layer) */}
        <div className="hidden md:block flex-1 h-full" />

        {/* Right Navigation Controls */}
        <div className="w-full md:w-auto flex md:flex-col items-center justify-between md:justify-center gap-12 pointer-events-auto">
          {/* Flavor Indicators */}
          <div className="hidden md:flex flex-col items-end gap-3 mb-8">
            {flavors.map((f, i) => (
              <div 
                key={f.id} 
                className={`h-1 transition-all duration-500 rounded-full ${i === currentFlavorIndex ? 'w-12 bg-primary' : 'w-4 bg-white/10'}`}
              />
            ))}
          </div>

          <div className="flex md:flex-col items-center gap-6">
            <div className="hidden md:block">
               <span className="text-9xl font-headline font-bold text-white/5 select-none leading-none">
                {currentFlavor.id}
              </span>
            </div>
            
            <div className="flex md:flex-col items-center gap-4 bg-white/5 p-4 rounded-full backdrop-blur-xl border border-white/10">
              <button 
                onClick={() => changeFlavor("prev")}
                className="p-4 rounded-full hover:bg-primary transition-all group"
                aria-label="Previous Flavor"
              >
                <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
              </button>
              
              <div className="hidden md:block w-8 h-px bg-white/10" />
              
              <button 
                onClick={() => changeFlavor("next")}
                className="p-4 rounded-full hover:bg-primary transition-all group"
                aria-label="Next Flavor"
              >
                <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Socials Linkage */}
        <div className="absolute left-6 md:left-12 bottom-12 hidden md:flex flex-col items-center gap-8 pointer-events-auto">
          <a href="#" className="text-white/30 hover:text-primary transition-colors"><Instagram size={20} /></a>
          <a href="#" className="text-white/30 hover:text-primary transition-colors"><Facebook size={20} /></a>
          <a href="#" className="text-white/30 hover:text-primary transition-colors"><Twitter size={20} /></a>
          <div className="w-px h-24 bg-gradient-to-t from-white/20 to-transparent" />
        </div>
      </div>
    </section>
  );
}
