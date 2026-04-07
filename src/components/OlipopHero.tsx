"use client";

import { useEffect, useState, useRef } from "react";
import { flavors } from "@/lib/flavor-data";
import { ChevronUp, ChevronDown, Instagram, Twitter, Facebook } from "lucide-react";
import Image from "next/image";
import { useUser, useFirestore } from "@/firebase";
import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { AuthModal } from "./AuthModal";

export function OlipopHero() {
  const [currentFlavorIndex, setCurrentFlavorIndex] = useState(0);
  const [isLoadingFlavor, setIsLoadingFlavor] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const currentFlavor = flavors[currentFlavorIndex];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const winHeight = window.innerHeight;
      const progress = Math.min(Math.max(scrollY / winHeight, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const addToCart = async () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    if (!db) return;

    try {
      const cartItemsRef = collection(db, "users", user.uid, "cart", "cart", "items");
      const q = query(cartItemsRef, where("productId", "==", currentFlavor.id));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const existing = snap.docs[0];
        await setDoc(doc(cartItemsRef, existing.id), {
          quantity: existing.data().quantity + 1
        }, { merge: true });
      } else {
        const newRef = doc(cartItemsRef);
        await setDoc(newRef, {
          id: newRef.id,
          productId: currentFlavor.id,
          quantity: 1,
          priceAtAddToCart: 12,
          cartId: 'cart'
        });
      }
      
      toast({ title: `${currentFlavor.name} added to cart!` });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Could not add to cart", description: e.message });
    }
  };

  const changeFlavor = (dir: "next" | "prev") => {
    setIsLoadingFlavor(true);
    let nextIdx = currentFlavorIndex;
    if (dir === "next") nextIdx = (currentFlavorIndex + 1) % flavors.length;
    else nextIdx = (currentFlavorIndex - 1 + flavors.length) % flavors.length;
    
    setTimeout(() => {
      setCurrentFlavorIndex(nextIdx);
      setIsLoadingFlavor(false);
    }, 400);
  };

  // Scroll "Scrub" logic for the WebP sequence
  const scale = 1 + scrollProgress * 0.3;
  const opacity = 1 - scrollProgress * 1.5;
  const yOffset = scrollProgress * -100;
  const rotate = scrollProgress * 15;

  return (
    <section 
      ref={sectionRef}
      id="hero" 
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* Cinematic WebP Sequence Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div 
          className={`relative w-full h-full transition-all duration-700 ease-out transform ${isLoadingFlavor ? 'opacity-0 scale-95 blur-xl' : 'opacity-100'}`}
          style={{
            transform: `translateY(${yOffset}px) scale(${scale}) rotate(${rotate}deg)`,
            opacity: opacity
          }}
        >
          <Image 
            src={currentFlavor.videoUrl} 
            alt={`${currentFlavor.name} animation`} 
            fill 
            className="object-contain p-8 md:p-24"
            unoptimized
            priority
          />
        </div>
      </div>

      <div className="absolute inset-0 hero-vignette z-10 pointer-events-none" />

      <div className="relative z-20 h-full w-full flex items-center justify-between px-6 md:px-24">
        
        {/* Left Content */}
        <div 
          className={`max-w-lg transition-all duration-700 ${isLoadingFlavor ? 'opacity-0 -translate-x-12 blur-md' : 'opacity-100 translate-x-0 blur-0'}`}
          style={{ 
            opacity: 1 - scrollProgress * 2.5,
            transform: `translateX(-${scrollProgress * 60}px)` 
          }}
        >
          <div className="space-y-6">
            <p className="text-white/30 font-bold tracking-[0.5em] uppercase text-[10px]">
              OLLANHO — FRESH PRESSED
            </p>
            <h1 
              className="text-7xl md:text-[9rem] font-headline font-bold leading-[0.8] tracking-tighter transition-colors duration-500 uppercase"
              style={{ color: currentFlavor.accentHex }}
            >
              {currentFlavor.name}
            </h1>
            <p className="text-sm md:text-base font-headline tracking-[0.4em] text-white/50 uppercase">
              {currentFlavor.subtitle}
            </p>
            <p className="text-[11px] md:text-xs text-white/40 leading-relaxed max-w-[320px] font-light">
              {currentFlavor.description}
            </p>
            <div className="flex gap-4 pt-6">
              <button 
                onClick={addToCart}
                className="px-10 py-4 bg-white text-black font-bold rounded-full uppercase tracking-widest text-[10px] hover:bg-neutral-200 transition-all border border-white"
              >
                ADD TO CART
              </button>
              <button className="px-10 py-4 border border-white/20 text-white font-bold rounded-full uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all backdrop-blur-sm">
                $12.00
              </button>
            </div>
          </div>
        </div>

        {/* Right Navigation */}
        <div className="flex flex-col items-center gap-12">
          <div className="text-center">
             <span className="font-headline font-bold text-7xl md:text-9xl text-white/5 leading-none select-none">
               {currentFlavor.index}
             </span>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => changeFlavor("prev")}
              className="group flex flex-col items-center gap-3 py-4 text-[10px] font-bold tracking-[0.3em] text-white/30 hover:text-white transition-all"
            >
              <ChevronUp className="w-5 h-5 group-hover:-translate-y-2 transition-transform" />
              PREV
            </button>
            <div className="w-px h-12 bg-white/10" />
            <button 
              onClick={() => changeFlavor("next")}
              className="group flex flex-col items-center gap-3 py-4 text-[10px] font-bold tracking-[0.3em] text-white/30 hover:text-white transition-all"
            >
              NEXT
              <ChevronDown className="w-5 h-5 group-hover:translate-y-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-12 left-6 md:left-24 z-30 flex gap-3">
        {flavors.map((f, i) => (
          <button
            key={f.id}
            onClick={() => {
              if (i === currentFlavorIndex) return;
              setIsLoadingFlavor(true);
              setTimeout(() => {
                setCurrentFlavorIndex(i);
                setIsLoadingFlavor(false);
              }, 400);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${i === currentFlavorIndex ? 'bg-white scale-150 shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'bg-white/10 hover:bg-white/40'}`}
          />
        ))}
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-8">
        <Instagram className="w-5 h-5 text-white/20 hover:text-white transition-colors cursor-pointer" />
        <Twitter className="w-5 h-5 text-white/20 hover:text-white transition-colors cursor-pointer" />
        <Facebook className="w-5 h-5 text-white/20 hover:text-white transition-colors cursor-pointer" />
      </div>

      <div className="absolute bottom-12 right-6 md:right-24 z-30 flex flex-col items-center gap-4">
        <div className="w-px h-12 bg-gradient-to-t from-white/20 to-transparent scroll-hint-line" />
        <span className="text-[9px] font-bold tracking-[0.5em] uppercase text-white/20">SCROLL</span>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </section>
  );
}