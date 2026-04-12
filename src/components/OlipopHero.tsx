"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { flavors } from "@/lib/flavor-data";
import { ChevronUp, ChevronDown, Instagram, Twitter, Facebook } from "lucide-react";
import Image from "next/image";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { AuthModal } from "./AuthModal";

export function OlipopHero() {
  const [currentFlavorIndex, setCurrentFlavorIndex] = useState(0);
  const [isLoadingFlavor, setIsLoadingFlavor] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { user } = useUser();
  const db = useFirestore();
  const currentFlavor = flavors[currentFlavorIndex];

  // Manual and Auto transition logic
  const changeFlavor = useCallback((dir: "next" | "prev") => {
    if (isLoadingFlavor) return;
    setIsLoadingFlavor(true);
    
    let nextIdx = currentFlavorIndex;
    if (dir === "next") {
      nextIdx = (currentFlavorIndex + 1) % flavors.length;
    } else {
      nextIdx = (currentFlavorIndex - 1 + flavors.length) % flavors.length;
    }
    
    // Smooth fade transition
    setTimeout(() => {
      setCurrentFlavorIndex(nextIdx);
      setIsLoadingFlavor(false);
    }, 400); // Increased slightly for smoother blend
  }, [currentFlavorIndex, isLoadingFlavor]);

  // Automatic rotation: 8s full play + 2s wait = 10s cycle
  useEffect(() => {
    const autoRotateTimer = setTimeout(() => {
      changeFlavor("next");
    }, 10000); // 10 seconds per flavor cycle

    return () => clearTimeout(autoRotateTimer);
  }, [currentFlavorIndex, changeFlavor]);

  // Preload neighboring assets
  useEffect(() => {
    const nextIdx = (currentFlavorIndex + 1) % flavors.length;
    const prevIdx = (currentFlavorIndex - 1 + flavors.length) % flavors.length;
    
    [nextIdx, prevIdx].forEach(idx => {
      const img = new (window as any).Image();
      img.src = flavors[idx].videoUrl;
    });
  }, [currentFlavorIndex]);

  const productRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, "products", currentFlavor.id);
  }, [db, currentFlavor.id]);

  const { data: productData } = useDoc(productRef);

  const price = productData?.price ?? 12.00;
  const isSoldOut = productData?.amount === 0;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const winHeight = window.innerHeight;
      const progress = Math.min(Math.max(scrollY / (winHeight * 0.8), 0), 1);
      
      if (heroImageRef.current) {
        const scale = 1 + progress * 0.05;
        const opacity = 1 - progress * 1.5;
        heroImageRef.current.style.transform = `translate3d(0, ${progress * -30}px, 0) scale(${scale})`;
        heroImageRef.current.style.opacity = opacity.toString();
      }

      if (contentRef.current) {
        const opacity = 1 - progress * 2.5;
        contentRef.current.style.opacity = opacity.toString();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOrderNow = () => {
    const section = document.getElementById('product');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative h-[100svh] w-full overflow-hidden bg-black flex items-center">
      {/* Background Animated WebP */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div 
          ref={heroImageRef}
          className={`relative w-full h-full transition-all duration-700 ease-in-out will-change-transform ${isLoadingFlavor ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}
        >
          <Image 
            src={currentFlavor.videoUrl} 
            alt={`${currentFlavor.name} sequence`} 
            fill 
            className="object-contain p-8 md:p-20"
            unoptimized 
            priority 
          />
        </div>
      </div>

      <div className="absolute inset-0 hero-vignette z-10 pointer-events-none" />

      {/* Main Content Overlay */}
      <div className="relative z-20 h-full w-full flex items-center justify-between px-6 md:px-24">
        <div 
          ref={contentRef}
          className={`max-w-md transition-all duration-500 ${isLoadingFlavor ? 'opacity-0 translate-y-4 blur-md' : 'opacity-100 translate-y-0 blur-0'}`}
        >
          <div className="space-y-6">
            <p className="text-white/40 font-bold tracking-[0.5em] text-[9px] uppercase">
              Olipop — real pressed
            </p>
            <h1 
              className="text-5xl md:text-7xl lg:text-9xl font-headline font-bold leading-[0.85] tracking-tighter uppercase"
              style={{ color: currentFlavor.accentHex }}
            >
              {currentFlavor.name}
            </h1>
            <p className="text-[11px] md:text-[12px] font-accent tracking-[0.2em] italic transition-colors duration-500" style={{ color: `${currentFlavor.accentHex}80` }}>
              {currentFlavor.subtitle}
            </p>
            <p className="text-[10px] md:text-[11px] text-white/40 leading-relaxed max-w-[300px] font-light">
              {productData?.description || currentFlavor.description}
            </p>
            
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] uppercase tracking-widest text-white/30">Cold Pressed</span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] uppercase tracking-widest text-white/30">High Vit C</span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] uppercase tracking-widest text-white/30">No Added Sugar</span>
            </div>

            <div className="flex gap-4 pt-8">
              <button 
                onClick={handleOrderNow}
                style={{ 
                  backgroundColor: isSoldOut ? '#333' : currentFlavor.accentHex,
                  color: '#000'
                }}
                className={`px-8 py-4 font-bold rounded-full uppercase tracking-widest text-[10px] transition-all active:scale-95 hover:scale-105 shadow-2xl`}
              >
                {isSoldOut ? "SOLD OUT" : "ORDER NOW →"}
              </button>
              <button 
                style={{ 
                  borderColor: `${currentFlavor.accentHex}40`, 
                  color: 'white' 
                }}
                className="px-8 py-4 border bg-white/5 text-white font-bold rounded-full uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                ${price.toFixed(2)}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation and Flavor Counter */}
        <div className="flex flex-col items-center gap-12">
          <div className="text-center relative">
             <span 
               className="font-headline font-bold text-7xl md:text-[10rem] leading-none select-none transition-all duration-1000 inline-block"
               style={{ 
                 color: 'transparent', 
                 WebkitTextStroke: `1px ${currentFlavor.accentHex}20`,
                 transform: isLoadingFlavor ? 'scale(0.8) rotate(-5deg)' : 'scale(1) rotate(0deg)'
               }}
             >
               {currentFlavor.index}
             </span>
             <p className="text-[9px] uppercase tracking-[0.5em] mt-2 font-bold transition-colors duration-500" style={{ color: `${currentFlavor.accentHex}40` }}>
               {currentFlavor.index} / 07
             </p>
          </div>
          
          <div className="flex flex-col items-center gap-5">
            <button 
              onClick={() => changeFlavor("prev")}
              className="group flex flex-col items-center gap-2 py-2 text-[10px] font-bold tracking-[0.4em] text-white/20 hover:text-white transition-all"
            >
              <ChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              PREV
            </button>
            <div className="w-px h-12 bg-white/10" />
            <button 
              onClick={() => changeFlavor("next")}
              className="group flex flex-col items-center gap-2 py-2 text-[10px] font-bold tracking-[0.4em] text-white/20 hover:text-white transition-all"
            >
              NEXT
              <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-8">
        <Instagram className="w-4 h-4 text-white/15 hover:text-primary transition-colors cursor-pointer" />
        <Twitter className="w-4 h-4 text-white/15 hover:text-primary transition-colors cursor-pointer" />
        <Facebook className="w-4 h-4 text-white/15 hover:text-primary transition-colors cursor-pointer" />
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </section>
  );
}