
"use client";

import { useEffect, useState, useRef } from "react";
import { flavors } from "@/lib/flavor-data";
import { ChevronUp, ChevronDown, Instagram, Twitter, Facebook } from "lucide-react";
import Image from "next/image";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
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
        const opacity = 1 - progress * 1.2;
        heroImageRef.current.style.transform = `translate3d(0, ${progress * -30}px, 0) scale(${scale})`;
        heroImageRef.current.style.opacity = opacity.toString();
      }

      if (contentRef.current) {
        const opacity = 1 - progress * 2.2;
        contentRef.current.style.opacity = opacity.toString();
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
    if (!db || isSoldOut) return;

    try {
      const cartItemsRef = collection(db, "users", user.uid, "cart", "cart", "items");
      const q = query(cartItemsRef, where("productId", "==", currentFlavor.id));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const existing = snap.docs[0];
        setDoc(doc(cartItemsRef, existing.id), {
          quantity: existing.data().quantity + 1
        }, { merge: true });
      } else {
        const newRef = doc(cartItemsRef);
        setDoc(newRef, {
          id: newRef.id,
          productId: currentFlavor.id,
          quantity: 1,
          priceAtAddToCart: price,
          cartId: 'cart'
        });
      }
      
      const hubRef = doc(collection(db, "central_hub"));
      setDoc(hubRef, {
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
    <section id="hero" className="relative h-[100svh] w-full overflow-hidden bg-black flex items-center">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div 
          ref={heroImageRef}
          className={`relative w-full h-full transition-all duration-700 ease-out will-change-transform ${isLoadingFlavor ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
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

      <div className="relative z-20 h-full w-full flex items-center justify-between px-6 md:px-24">
        <div 
          ref={contentRef}
          className={`max-w-md transition-all duration-500 ${isLoadingFlavor ? 'opacity-0 translate-y-2 blur-sm' : 'opacity-100 translate-y-0 blur-0'}`}
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
                onClick={addToCart}
                disabled={isSoldOut}
                style={{ backgroundColor: isSoldOut ? '#333' : currentFlavor.accentHex }}
                className={`px-8 py-4 text-black font-bold rounded-full uppercase tracking-widest text-[10px] transition-all active:scale-95 ${isSoldOut ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'}`}
              >
                {isSoldOut ? 'SOLD OUT' : 'ORDER NOW →'}
              </button>
              <button 
                style={{ borderColor: `${currentFlavor.accentHex}30`, color: currentFlavor.accentHex }}
                className="px-8 py-4 border bg-white/5 text-white font-bold rounded-full uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                ${price.toFixed(2)}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-12">
          <div className="text-center relative">
             <span 
               className="font-headline font-bold text-7xl md:text-[10rem] leading-none select-none transition-all duration-700 inline-block"
               style={{ 
                 color: 'transparent', 
                 WebkitTextStroke: `1px ${currentFlavor.accentHex}20`,
                 transform: isLoadingFlavor ? 'scale(0.9) translateY(10px)' : 'scale(1) translateY(0)'
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

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-8">
        <Instagram className="w-4 h-4 text-white/15 hover:text-white transition-colors cursor-pointer" />
        <Twitter className="w-4 h-4 text-white/15 hover:text-white transition-colors cursor-pointer" />
        <Facebook className="w-4 h-4 text-white/15 hover:text-white transition-colors cursor-pointer" />
      </div>

      <div className="absolute bottom-12 right-6 md:right-24 z-30 flex flex-col items-center gap-4">
        <div className="w-px h-12 bg-gradient-to-t from-white/30 to-transparent scroll-hint-line" />
        <span className="text-[8px] font-bold tracking-[0.6em] uppercase text-white/20">SCROLL</span>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </section>
  );
}
