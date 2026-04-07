
"use client";

import { useState } from "react";
import { Loader } from "@/components/Loader";
import { Navbar } from "@/components/Navbar";
import { OlipopHero } from "@/components/OlipopHero";
import { 
  IngredientsSection, 
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
        <IngredientsSection />
        <NutritionSection />
        <ReviewsSection />
        <FAQSection />
        
        {/* Final CTA */}
        <section id="contact" className="py-32 bg-primary relative z-10 flex flex-col items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          </div>
          <div className="container mx-auto px-6 relative">
            <h2 className="text-5xl md:text-8xl font-headline font-bold text-white uppercase leading-none mb-12 tracking-tighter">
              DRINK TO YOUR <br />FUTURE SELF.
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="px-12 py-5 bg-black text-white font-bold hover:bg-neutral-900 transition-colors uppercase tracking-widest text-sm rounded-sm">
                Shop Variety Pack
              </button>
              <button className="px-12 py-5 border-2 border-white text-white font-bold hover:bg-white hover:text-primary transition-colors uppercase tracking-widest text-sm rounded-sm">
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
