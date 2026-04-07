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
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const currentFlavor = flavors[currentFlavorIndex];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const winHeight = window.innerHeight;
      const progress = Math.min(Math.max(scrollY / winHeight, 0), 1);
      
      if (heroImageRef.current) {
        const scale = 1 + progress * 0.15;
        const opacity = 1 - progress * 1.5;
        const yOffset = progress * -60;
        const rotate = progress * 6;
        heroImageRef.current.style.transform = `translate3d(0, ${yOffset}px, 0) scale(${scale}) rotate(${rotate}deg)`;
        heroImageRef.current.style.opacity = opacity.toString();
      }

      if (contentRef.current) {
        const opacity = 1 - progress * 2.5;
        const xOffset = progress * -50;
        contentRef.current.style.opacity = opacity.toString();
        contentRef.current.style.transform = `translate3d(${xOffset}px, 0, 0)`;
      }
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

  return (
    <section 
      id="hero" 
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* Background WebP Animation - Hardware Accelerated */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div 
          ref={heroImageRef}
          className={`relative w-full h-full transition-opacity duration-700 ease-out will-change-transform ${isLoadingFlavor ? 'opacity-0 scale-95 blur-xl' : 'opacity-100'}`}
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          <Image 
            src={currentFlavor.videoUrl} 
            alt={`${currentFlavor.name} animation`} 
            fill 
            className="object-contain p-12 md:p-32"
            unoptimized
            priority
          />
        </div>
      </div>

      <div className="absolute inset-0 hero-vignette z-10 pointer-events-none" />

      <div className="relative z-20 h-full w-full flex items-center justify-between px-6 md:px-24">
        
        {/* Left Content */}
        <div 
          ref={contentRef}
          className={`max-w-lg transition-all duration-700 will-change-transform ${isLoadingFlavor ? 'opacity-0 -translate-x-8 blur-md' : 'opacity-100 translate-x-0 blur-0'}`}
        >
          <div className="space-y-4 md:space-y-5">
            <p className="text-white/30 font-bold tracking-[0.4em] uppercase text-[9px]">
              OLLANHO — FRESH PRESSED
            </p>
            <h1 
              className="text-6xl md:text-7xl lg:text-8xl font-headline font-bold leading-[0.85] tracking-tighter transition-colors duration-500 uppercase"
              style={{ color: currentFlavor.accentHex }}
            >
              {currentFlavor.name}
            </h1>
            <p className="text-[10px] md:text-xs font-headline tracking-[0.3em] text-white/40 uppercase">
              {currentFlavor.subtitle}
            </p>
            <p className="text-[9px] md:text-[10px] text-white/30 leading-relaxed max-w-[280px] font-light">
              {currentFlavor.description}
            </p>
            <div className="flex gap-4 pt-4 md:pt-6">
              <button 
                onClick={addToCart}
                className="px-8 py-3 bg-white text-black font-bold rounded-full uppercase tracking-widest text-[9px] hover:bg-neutral-200 transition-all"
              >
                ADD TO CART
              </button>
              <button className="px-8 py-3 border border-white/20 text-white font-bold rounded-full uppercase tracking-widest text-[9px] hover:bg-white/10 transition-all backdrop-blur-sm">
                $12.00
              </button>
            </div>
          </div>
        </div>

        {/* Right Navigation */}
        <div className="flex flex-col items-center gap-8 md:gap-12">
          <div className="text-center">
             <span className="font-headline font-bold text-6xl md:text-8xl text-white/5 leading-none select-none">
               {currentFlavor.index}
             </span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <button 
              onClick={() => changeFlavor("prev")}
              className="group flex flex-col items-center gap-1 py-2 text-[8px] md:text-[9px] font-bold tracking-[0.3em] text-white/30 hover:text-white transition-all"
            >
              <ChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              PREV
            </button>
            <div className="w-px h-8 bg-white/10" />
            <button 
              onClick={() => changeFlavor("next")}
              className="group flex flex-col items-center gap-1 py-2 text-[8px] md:text-[9px] font-bold tracking-[0.3em] text-white/30 hover:text-white transition-all"
            >
              NEXT
              <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-10 left-6 md:left-24 z-30 flex gap-2">
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
            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === currentFlavorIndex ? 'bg-white scale-150 shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-white/10 hover:bg-white/40'}`}
          />
        ))}
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-6">
        <Instagram className="w-4 h-4 text-white/20 hover:text-white transition-colors cursor-pointer" />
        <Twitter className="w-4 h-4 text-white/20 hover:text-white transition-colors cursor-pointer" />
        <Facebook className="w-4 h-4 text-white/20 hover:text-white transition-colors cursor-pointer" />
      </div>

      <div className="absolute bottom-10 right-6 md:right-24 z-30 flex flex-col items-center gap-3">
        <div className="w-px h-8 bg-gradient-to-t from-white/20 to-transparent scroll-hint-line" />
        <span className="text-[7px] font-bold tracking-[0.5em] uppercase text-white/20">SCROLL</span>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </section>
  );
}