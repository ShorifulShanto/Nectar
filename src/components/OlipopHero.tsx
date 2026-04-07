
"use client";

import { useEffect, useState, useMemo } from "react";
import { flavors } from "@/lib/flavor-data";
import { ChevronUp, ChevronDown, Instagram, Facebook, Twitter } from "lucide-react";
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 500);
  };

  return (
    <section id="product" className="relative min-h-screen w-full overflow-hidden">
      {/* Background Layer (Video or Image) */}
      <div className="absolute inset-0 z-0">
        {currentFlavor.videoUrl ? (
          <video 
            key={currentFlavor.videoUrl}
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-60"
          >
            <source src={currentFlavor.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
             {/* Gradient splash behind the product */}
             <div 
               className="absolute w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-20 transition-colors duration-1000"
               style={{ backgroundColor: currentFlavor.hex }}
             />
             
             {currentPlaceholder && (
               <div className={`relative w-full h-full transition-all duration-1000 transform ${isLoadingFlavor ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}>
                 <Image 
                   src={currentPlaceholder.imageUrl}
                   alt={currentPlaceholder.description}
                   fill
                   className="object-contain p-20"
                   priority
                   data-ai-hint={currentPlaceholder.imageHint}
                 />
               </div>
             )}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 h-screen w-full flex items-center px-6 md:px-12">
        
        {/* Left Content */}
        <div className={`max-w-xl transition-all duration-700 ${isLoadingFlavor ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <p className="text-primary font-bold tracking-[0.3em] uppercase mb-2 text-sm">
            {currentFlavor.subtitle}
          </p>
          <h1 className="text-6xl md:text-9xl font-headline font-bold uppercase leading-none mb-6">
            {currentFlavor.name}
          </h1>
          <p className="text-lg text-white/70 mb-8 max-w-md leading-relaxed">
            {aiDescription || currentFlavor.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 border border-white text-white font-bold hover:bg-white hover:text-black transition-colors rounded-sm uppercase tracking-widest text-xs">
              Shop Now
            </button>
            <button className="px-8 py-4 bg-white text-black font-bold hover:bg-white/90 transition-colors rounded-sm uppercase tracking-widest text-xs">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Navigation */}
        <div className="ml-auto flex flex-col items-center">
          <div className="flex flex-col items-center gap-6">
            <span className="text-5xl md:text-7xl font-headline font-bold text-white/10 select-none">
              {currentFlavor.id}
            </span>
            
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={() => changeFlavor("prev")}
                className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
                aria-label="Previous Flavor"
              >
                <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
              </button>
              
              <div className="w-px h-12 bg-white/20" />
              
              <button 
                onClick={() => changeFlavor("next")}
                className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
                aria-label="Next Flavor"
              >
                <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Socials */}
        <div className="absolute bottom-12 left-6 md:left-12 flex items-center gap-6">
          <a href="#" className="text-white/40 hover:text-white transition-colors"><Instagram size={20} /></a>
          <a href="#" className="text-white/40 hover:text-white transition-colors"><Facebook size={20} /></a>
          <a href="#" className="text-white/40 hover:text-white transition-colors"><Twitter size={20} /></a>
        </div>
      </div>
    </section>
  );
}
