
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
        <section id="contact" className="py-40 bg-primary relative z-10 flex flex-col items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             <div className="w-full h-full bg-[radial-gradient(circle_at_center,_white,_transparent_70%)]" />
          </div>
          <div className="container mx-auto px-6 relative">
            <h2 className="text-6xl md:text-[10rem] font-headline font-bold text-white uppercase leading-[0.8] mb-16 tracking-tighter">
              A BETTER <br />WAY TO SODA.
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="px-14 py-6 bg-black text-white font-bold hover:bg-neutral-900 transition-all uppercase tracking-[0.2em] text-[11px] rounded-full shadow-2xl">
                Shop Variety Pack
              </button>
              <button className="px-14 py-6 border-2 border-white text-white font-bold hover:bg-white hover:text-primary transition-all uppercase tracking-[0.2em] text-[11px] rounded-full">
                Find in Store
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
