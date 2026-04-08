"use client";

import { useEffect, useState, useRef } from "react";
import { flavors } from "@/lib/flavor-data";
import { ChevronUp, ChevronDown, Instagram, Twitter, Facebook } from "lucide-react";
import Image from "next/image";
import { useUser, useFirestore } from "@/firebase";
import { collection, doc, setDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
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
      const progress = Math.min(Math.max(scrollY / (winHeight * 0.8), 0), 1);
      
      if (heroImageRef.current) {
        const scale = 1 + progress * 0.15;
        const opacity = 1 - progress * 1.5;
        const yOffset = progress * -60;
        const rotation = progress * 10;
        heroImageRef.current.style.transform = `translate3d(0, ${yOffset}px, 0) scale(${scale}) rotate(${rotation}deg)`;
        heroImageRef.current.style.opacity = opacity.toString();
      }

      if (contentRef.current) {
        const opacity = 1 - progress * 2.2;
        const xOffset = progress * -30;
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
      
      const hubRef = doc(collection(db, "central_hub"));
      await setDoc(hubRef, {
        id: hubRef.id,
        type: "cart_addition",
        userId: user.uid,
        userEmail: user.email,
        payload: { productId: currentFlavor.id, flavorName: currentFlavor.name },
        timestamp: new Date().toISOString(),
        createdAt: serverTimestamp()
      });

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
    <section id="hero" className="relative h-screen w-full overflow-hidden bg-black flex items-center">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div 
          ref={heroImageRef}
          className={`relative w-full h-full transition-opacity duration-700 ease-out will-change-transform ${isLoadingFlavor ? 'opacity-0 scale-95' : 'opacity-100'}`}
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          <Image 
            src={currentFlavor.videoUrl} 
            alt={`${currentFlavor.name} sequence`} 
            fill 
            className="object-contain p-8 md:p-24"
            unoptimized
            priority
          />
        </div>
      </div>

      <div className="absolute inset-0 hero-vignette z-10 pointer-events-none" />

      <div className="relative z-20 h-full w-full flex items-center justify-between px-6 md:px-24">
        <div 
          ref={contentRef}
          className={`max-w-md transition-all duration-700 will-change-transform ${isLoadingFlavor ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'}`}
        >
          <div className="space-y-6">
            <p className="text-white/30 font-bold tracking-[0.4em] uppercase text-[9px]">
              OLLANHO — FRESH PRESSED
            </p>
            <h1 
              className="text-4xl md:text-5xl lg:text-7xl font-headline font-bold leading-[0.8] tracking-tighter transition-colors duration-500 uppercase"
              style={{ color: currentFlavor.accentHex }}
            >
              {currentFlavor.name}
            </h1>
            <p className="text-[10px] md:text-[11px] font-headline tracking-[0.3em] text-white/40 uppercase">
              {currentFlavor.subtitle}
            </p>
            <p className="text-[10px] md:text-[11px] text-white/30 leading-relaxed max-w-[280px] font-light">
              {currentFlavor.description}
            </p>
            
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 border border-white/10 rounded-full text-[8px] uppercase tracking-widest text-white/40">Cold Pressed</span>
              <span className="px-3 py-1 border border-white/10 rounded-full text-[8px] uppercase tracking-widest text-white/40">Vit C</span>
              <span className="px-3 py-1 border border-white/10 rounded-full text-[8px] uppercase tracking-widest text-white/40">No Sugar</span>
            </div>

            <div className="flex gap-4 pt-6">
              <button 
                onClick={addToCart}
                style={{ backgroundColor: currentFlavor.accentHex }}
                className="px-8 py-3.5 text-black font-bold rounded-full uppercase tracking-widest text-[10px] hover:brightness-110 transition-all shadow-lg"
              >
                ORDER NOW →
              </button>
              <button 
                style={{ borderColor: `${currentFlavor.accentHex}40`, color: currentFlavor.accentHex }}
                className="px-8 py-3.5 border text-white font-bold rounded-full uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all backdrop-blur-sm"
              >
                $12.00
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-10">
          <div className="text-center">
             <span 
               className="font-headline font-bold text-7xl md:text-9xl leading-none select-none transition-colors duration-500"
               style={{ 
                 color: 'transparent', 
                 WebkitTextStroke: `1px ${currentFlavor.accentHex}20` 
               }}
             >
               {currentFlavor.index}
             </span>
             <p className="text-[9px] uppercase tracking-[0.4em] mt-2" style={{ color: `${currentFlavor.accentHex}40` }}>
               {currentFlavor.index} / 07
             </p>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => changeFlavor("prev")}
              className="group flex flex-col items-center gap-2 py-2 text-[10px] font-bold tracking-[0.3em] text-white/30 hover:text-white transition-all"
            >
              <ChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              PREV
            </button>
            <div className="w-px h-10 bg-white/10" />
            <button 
              onClick={() => changeFlavor("next")}
              className="group flex flex-col items-center gap-2 py-2 text-[10px] font-bold tracking-[0.3em] text-white/30 hover:text-white transition-all"
            >
              NEXT
              <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-6 md:left-24 z-30 flex gap-2">
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
            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === currentFlavorIndex ? 'bg-white scale-125' : 'bg-white/10'}`}
          />
        ))}
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-6">
        <Instagram className="w-4 h-4 text-white/20 hover:text-white transition-colors cursor-pointer" />
        <Twitter className="w-4 h-4 text-white/20 hover:text-white transition-colors cursor-pointer" />
        <Facebook className="w-4 h-4 text-white/20 hover:text-white transition-colors cursor-pointer" />
      </div>

      <div className="absolute bottom-12 right-6 md:right-24 z-30 flex flex-col items-center gap-3">
        <div className="w-px h-10 bg-gradient-to-t from-white/20 to-transparent scroll-hint-line" />
        <span className="text-[8px] font-bold tracking-[0.5em] uppercase text-white/20">SCROLL</span>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </section>
  );
}