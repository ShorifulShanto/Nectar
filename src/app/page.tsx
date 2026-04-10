
"use client";

import { useState } from "react";
import { Loader } from "@/components/Loader";
import { Navbar } from "@/components/Navbar";
import { OlipopHero } from "@/components/OlipopHero";
import { 
  IngredientsSection, 
  ProductCollection,
  NutritionSection, 
  ReviewsSection, 
  FAQSection, 
  Footer 
} from "@/components/Sections";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  const scrollToProducts = () => {
    document.getElementById('product')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {!isLoaded && <Loader onComplete={() => setIsLoaded(true)} />}
      
      <main className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar />
        <OlipopHero />
        <ProductCollection />
        <IngredientsSection />
        <NutritionSection />
        <ReviewsSection />
        <FAQSection />
        
        {/* Final CTA */}
        <section id="cta-section" className="py-32 bg-black relative flex flex-col items-center justify-center text-center overflow-hidden border-t border-white/5">
          <div className="absolute inset-0 opacity-5 pointer-events-none select-none">
             <h2 className="text-[15rem] font-headline font-bold text-white leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
               FRESH
             </h2>
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <p className="text-white/30 text-[9px] uppercase tracking-[0.4em] mb-4">GET STARTED</p>
            <h2 className="text-5xl md:text-7xl font-headline font-bold text-white uppercase leading-[0.9] mb-8 tracking-tighter">
              TASTE THE<br />DIFFERENCE
            </h2>
            <p className="text-white/40 max-w-lg mx-auto mb-10 text-base font-light leading-relaxed">
              Order your first case today and discover why thousands have made OLLANHO their daily ritual. Real fruit. Real taste. Real good.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={scrollToProducts}
                className="px-10 py-4 border border-white text-white font-bold hover:bg-white hover:text-black transition-all uppercase tracking-[0.2em] text-[9px] rounded-full"
              >
                EXPLORE ALL
              </button>
              <button 
                onClick={scrollToProducts}
                className="px-10 py-4 bg-primary text-black font-bold hover:bg-primary/80 transition-all uppercase tracking-[0.2em] text-[9px] rounded-full"
              >
                SHOP NOW
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
