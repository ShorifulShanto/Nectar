
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { flavors, Flavor } from "@/lib/flavor-data";
import { ChevronUp, ChevronDown, Instagram, Facebook, Twitter } from "lucide-react";
import { generateFlavorDescription } from "@/ai/flows/generate-flavor-description";

export function OlipopHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFlavorIndex, setCurrentFlavorIndex] = useState(0);
  const [frameIndex, setFrameIndex] = useState(1);
  const [isLoadingFlavor, setIsLoadingFlavor] = useState(false);
  const [aiDescription, setAiDescription] = useState<string>("");
  const totalFrames = 240;
  
  const currentFlavor = flavors[currentFlavorIndex];

  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // In a real app, we would load images from /public/${flavor.name}/frame_${idx}.webp
    // For this prototype, we'll simulate the animation by drawing placeholders
    // or showing the current flavor's representative color splash
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Simulate animation: Draw a circle that moves/scales with scroll
    const progress = idx / totalFrames;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 200 + (progress * 150);
    
    const gradient = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, radius);
    gradient.addColorStop(0, currentFlavor.hex);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw frame index for debugging simulation
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.font = "200px Space Grotesk";
    ctx.textAlign = "center";
    ctx.fillText(currentFlavor.id, centerX, centerY + 70);
  }, [currentFlavor]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollFraction = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      const idx = Math.min(totalFrames, Math.max(1, Math.floor(scrollFraction * totalFrames)));
      setFrameIndex(idx);
      drawFrame(idx);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Initial draw
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(1);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [drawFrame]);

  const changeFlavor = async (dir: "next" | "prev") => {
    setIsLoadingFlavor(true);
    let nextIdx = currentFlavorIndex;
    if (dir === "next") nextIdx = (currentFlavorIndex + 1) % flavors.length;
    else nextIdx = (currentFlavorIndex - 1 + flavors.length) % flavors.length;
    
    // Simulate AI generation for the new flavor
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
    <section id="product" className="relative min-h-[300vh] w-full">
      {/* Canvas Layer */}
      <div className="canvas-container">
        <canvas ref={canvasRef} />
      </div>

      {/* Persistent Content Layer (Sticky) */}
      <div className="sticky top-0 h-screen w-full flex items-center px-6 md:px-12 pointer-events-none">
        
        {/* Left Content */}
        <div className={`max-w-xl transition-all duration-700 pointer-events-auto ${isLoadingFlavor ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
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
        <div className="ml-auto flex flex-col items-center pointer-events-auto">
          <div className="flex flex-col items-center gap-6">
            <span className="text-5xl md:text-7xl font-headline font-bold text-white/20 select-none">
              {currentFlavor.id}
            </span>
            
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={() => changeFlavor("prev")}
                className="p-3 rounded-full hover:bg-white/10 transition-colors group"
                aria-label="Previous Flavor"
              >
                <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
              </button>
              
              <div className="w-px h-12 bg-white/20" />
              
              <button 
                onClick={() => changeFlavor("next")}
                className="p-3 rounded-full hover:bg-white/10 transition-colors group"
                aria-label="Next Flavor"
              >
                <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Socials */}
        <div className="absolute bottom-12 left-6 md:left-12 flex items-center gap-6 pointer-events-auto">
          <a href="#" className="text-white/40 hover:text-white transition-colors"><Instagram size={20} /></a>
          <a href="#" className="text-white/40 hover:text-white transition-colors"><Facebook size={20} /></a>
          <a href="#" className="text-white/40 hover:text-white transition-colors"><Twitter size={20} /></a>
        </div>
      </div>
    </section>
  );
}
