"use client";

import { useEffect, useState, useRef } from "react";
import { flavors } from "@/lib/flavor-data";
import { ChevronUp, ChevronDown, Instagram, Twitter, Facebook } from "lucide-react";
import { generateFlavorDescription } from "@/ai/flows/generate-flavor-description";
import Image from "next/image";

export function OlipopHero() {
  const [currentFlavorIndex, setCurrentFlavorIndex] = useState(0);
  const [isLoadingFlavor, setIsLoadingFlavor] = useState(false);
  const [aiDescription, setAiDescription] = useState<string>("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const currentFlavor = flavors[currentFlavorIndex];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const winHeight = window.innerHeight;
      const progress = Math.min(Math.max(scrollY / winHeight, 0), 1);
      setScrollProgress(progress);
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

  return (
    <section 
      ref={sectionRef}
      id="hero" 
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* Background Sequence - Centered & Responsive to Scroll */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div 
          className={`relative w-full h-[120%] transition-all duration-1000 ease-in-out transform ${isLoadingFlavor ? 'opacity-0 scale-110 blur-xl' : 'opacity-100 scale-100 blur-0'}`}
          style={{
            transform: `translateY(${scrollProgress * -100}px) scale(${1 + scrollProgress * 0.2})`,
            opacity: 1 - scrollProgress * 0.5
          }}
        >
          <Image 
            src={currentFlavor.videoUrl} 
            alt={`${currentFlavor.name} sequence`} 
            fill 
            className="object-contain"
            unoptimized
            priority
          />
        </div>
      </div>

      <div className="absolute inset-0 hero-vignette z-10 pointer-events-none" />

      {/* UI Layers */}
      <div className="relative z-20 h-full w-full flex items-center justify-between px-6 md:px-24">
        
        {/* Left: Product Info */}
        <div 
          className={`max-w-xl transition-all duration-700 ${isLoadingFlavor ? 'opacity-0 -translate-x-12' : 'opacity-100 translate-x-0'}`}
          style={{ opacity: 1 - scrollProgress * 1.5, transform: `translateX(-${scrollProgress * 50}px)` }}
        >
          <div className="space-y-6">
            <p className="text-white/40 font-bold tracking-[0.4em] uppercase text-[10px]">
              OLLANHO — FRESH PRESSED
            </p>
            <h1 className="text-8xl md:text-[11rem] font-headline font-bold leading-[0.8] tracking-tighter text-white">
              {currentFlavor.name}
            </h1>
            <p className="text-xl md:text-2xl font-headline tracking-[0.3em] text-white/60">
              {currentFlavor.subtitle}
            </p>
            <p className="text-base text-white/40 leading-relaxed max-w-sm font-light">
              {aiDescription || currentFlavor.description}
            </p>
            <div className="flex gap-4 pt-4">
              <button className="px-10 py-4 border border-white text-white font-bold rounded-full uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all">
                ADD TO
              </button>
              <button className="px-10 py-4 bg-white text-black font-bold rounded-full uppercase tracking-widest text-[10px] hover:bg-transparent hover:text-white border border-white transition-all">
                CART
              </button>
            </div>
          </div>
        </div>

        {/* Right: Navigation Controls */}
        <div className="flex flex-col items-center gap-12">
          <div className="text-center">
             <span className="font-headline font-bold text-7xl md:text-9xl text-white/10 leading-none">
               {currentFlavor.index}
             </span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <button 
              onClick={() => changeFlavor("prev")}
              className="group flex flex-col items-center gap-2 py-4 text-[10px] font-bold tracking-[0.2em] text-white/40 hover:text-white transition-all"
            >
              <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              PREV
            </button>
            <div className="w-px h-12 bg-white/10" />
            <button 
              onClick={() => changeFlavor("next")}
              className="group flex flex-col items-center gap-2 py-4 text-[10px] font-bold tracking-[0.2em] text-white/40 hover:text-white transition-all"
            >
              NEXT
              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Flavor Dots (Bottom Left) */}
      <div className="absolute bottom-12 left-6 md:left-24 z-30 flex gap-3">
        {flavors.map((f, i) => (
          <button
            key={f.id}
            onClick={() => {
              if (i === currentFlavorIndex) return;
              setIsLoadingFlavor(true);
              setTimeout(() => setCurrentFlavorIndex(i), 400);
              setTimeout(() => setIsLoadingFlavor(false), 800);
            }}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === currentFlavorIndex ? 'bg-white scale-150 shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-white/20 hover:bg-white/50'}`}
          />
        ))}
      </div>

      {/* Socials (Bottom Center) */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-8">
        <Instagram className="w-5 h-5 text-white/30 hover:text-white transition-colors cursor-pointer" />
        <Twitter className="w-5 h-5 text-white/30 hover:text-white transition-colors cursor-pointer" />
        <Facebook className="w-5 h-5 text-white/30 hover:text-white transition-colors cursor-pointer" />
      </div>

      {/* Scroll Hint (Bottom Right) */}
      <div className="absolute bottom-12 right-6 md:right-24 z-30 flex flex-col items-center gap-4">
        <div className="w-px h-10 bg-gradient-to-t from-white/40 to-transparent scroll-hint-line" />
        <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-white/30">SCROLL</span>
      </div>
    </section>
  );
}