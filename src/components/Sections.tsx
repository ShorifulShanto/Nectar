"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Star, Leaf, Waves, ShieldCheck, Droplets, Zap, Wind } from "lucide-react";
import { flavors } from "@/lib/flavor-data";
import Image from "next/image";

export function IngredientsSection() {
  const ingredients = [
    { name: "Real Fruit", benefit: "100% cold-pressed whole fruit. No concentrates or artificial flavoring.", icon: Leaf },
    { name: "Pure Water", benefit: "Triple-filtered spring water for a perfectly clean finish.", icon: Waves },
    { name: "No Additives", benefit: "Zero artificial colors, flavors, or preservatives. Just fruit.", icon: ShieldCheck },
    { name: "Natural Sweetness", benefit: "Sweetened only with the natural sugars found in the fruit itself.", icon: Droplets },
    { name: "Vitamins", benefit: "Rich in Vitamin C, antioxidants, and natural electrolytes.", icon: Zap },
    { name: "Cold-Pressed", benefit: "HPP processing preserves nutrients and flavor at their peak.", icon: Wind },
  ];

  return (
    <section id="ingredients" className="py-32 bg-neutral-900/50">
      <div className="container mx-auto px-6 md:px-24">
        <div className="mb-20">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] mb-4">WHAT'S INSIDE</p>
          <h2 className="text-6xl md:text-8xl font-headline font-bold leading-tight">REAL INGREDIENTS<br />REAL BENEFITS</h2>
          <p className="text-white/40 mt-8 max-w-xl font-light text-lg">Every drop starts with real, whole fruit. No concentrates, no preservatives — just nature in a bottle.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {ingredients.map((item) => (
            <div key={item.name} className="p-10 border border-white/5 bg-black/30 rounded-2xl hover:border-white/20 transition-all duration-500 group">
              <div className="mb-6 text-white/60 group-hover:text-white transition-colors">
                <item.icon size={32} strokeWidth={1.5} />
              </div>
              <h4 className="text-xl font-headline font-bold mb-4">{item.name}</h4>
              <p className="text-sm text-white/30 leading-relaxed font-light">{item.benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductCollection() {
  return (
    <section id="product" className="py-32 bg-black border-y border-white/5">
      <div className="container mx-auto px-6 md:px-24">
        <div className="mb-20">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] mb-4">OUR COLLECTION</p>
          <h2 className="text-6xl md:text-8xl font-headline font-bold leading-tight">SEVEN FLAVORS<br />ONE OBSESSION</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {flavors.map((flavor) => (
            <div key={flavor.id} className="group cursor-pointer">
               <div className="aspect-[3/4] rounded-2xl bg-neutral-900 border border-white/5 overflow-hidden p-6 mb-4 flex flex-col items-center justify-center group-hover:border-white/20 transition-all duration-700">
                  <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-700">
                    <Image 
                      src={flavor.imageUrl} 
                      alt={flavor.name} 
                      fill 
                      className="object-contain"
                    />
                  </div>
               </div>
               <h4 className="text-xs font-bold text-center tracking-widest uppercase text-white/40 group-hover:text-white transition-colors">
                 {flavor.name}
               </h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NutritionSection() {
  return (
    <section id="nutrition" className="py-32 bg-black">
      <div className="container mx-auto px-6 md:px-24 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-24 items-start">
          <div className="p-8 border-4 border-white rounded-lg max-w-sm">
            <h3 className="text-4xl font-bold border-b-8 border-white pb-2 mb-2">Nutrition Facts</h3>
            <p className="text-xs text-white/60 border-b border-white/20 pb-2 mb-4">Serving Size: 1 Bottle (350ml) | Servings: 1</p>
            <div className="flex justify-between items-end border-b-4 border-white pb-2 mb-4">
              <span className="text-sm font-bold">Calories</span>
              <span className="text-4xl font-bold leading-none">110</span>
            </div>
            {[
              { label: "Total Fat", val: "0g" },
              { label: "Sodium", val: "15mg" },
              { label: "Total Carbohydrate", val: "27g" },
              { label: "Dietary Fiber", val: "1g", indent: true },
              { label: "Total Sugars", val: "22g", indent: true },
              { label: "Protein", val: "1g" },
              { label: "Vitamin C", val: "45%", highlight: true },
              { label: "Potassium", val: "8%", highlight: true },
            ].map((row) => (
              <div key={row.label} className={`flex justify-between py-1.5 border-b border-white/10 text-sm ${row.highlight ? 'font-bold' : ''}`}>
                <span className={row.indent ? 'pl-4' : ''}>{row.label}</span>
                <span className="text-white/60">{row.val}</span>
              </div>
            ))}
            <p className="text-[10px] text-white/40 mt-4 leading-tight italic">
              * Percent daily values are based on a 2,000 calorie diet. All values are approximate.
            </p>
          </div>
          
          <div className="space-y-12">
            <h2 className="text-5xl md:text-7xl font-headline font-bold leading-tight">NUTRITION<br />YOU CAN FEEL.</h2>
            {[
              { num: "01", title: "Immune Support", desc: "High Vitamin C content from real fruit helps strengthen your immune system naturally." },
              { num: "02", title: "Antioxidant Rich", desc: "Natural antioxidants from whole fruit combat free radicals and support cellular health." },
              { num: "03", title: "Hydration Boost", desc: "Natural electrolytes and water content keep you hydrated throughout the day." },
              { num: "04", title: "No Added Sugar", desc: "Every gram of sweetness comes directly from the fruit — nothing added, nothing artificial." },
            ].map((item) => (
              <div key={item.num} className="flex gap-8 items-start border-l border-white/10 pl-8 group">
                <span className="text-3xl font-headline font-bold text-white/20 group-hover:text-white transition-colors">{item.num}</span>
                <div>
                  <h4 className="text-xl font-bold mb-2 uppercase tracking-wider">{item.title}</h4>
                  <p className="text-white/40 font-light leading-relaxed text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  const reviews = [
    { name: "Sarah M.", flavor: "Guava Juice", rating: 5, text: "The guava flavor is absolutely incredible. Tastes exactly like fresh-cut fruit — I can't believe it comes in a bottle." },
    { name: "James K.", flavor: "Strawberry Yogurt", rating: 5, text: "Strawberry is my go-to every morning. Clean ingredients, no guilt, just pure delicious fruit juice." },
    { name: "Priya L.", flavor: "Pineapple Juice", rating: 4, text: "Finally a juice brand that actually tastes fresh. The pineapple is my personal favorite — tropical and perfect." },
    { name: "Marcus T.", flavor: "Grape Juice", rating: 5, text: "The grape juice converted me. Deep, rich flavor — nothing like the sugary stuff. Will subscribe for life." },
  ];

  return (
    <section id="reviews" className="py-32 bg-neutral-900/50">
      <div className="container mx-auto px-6 md:px-24">
        <div className="mb-20 text-center">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] mb-4">WHAT PEOPLE SAY</p>
          <h2 className="text-6xl md:text-8xl font-headline font-bold">LOVED BY THOUSANDS</h2>
        </div>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="bg-black p-10 rounded-2xl border border-white/10 text-center flex flex-col justify-center items-center">
            <span className="text-8xl font-headline font-bold">4.9</span>
            <div className="flex gap-1 my-4 text-white">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
            </div>
            <p className="text-xs text-white/30 uppercase tracking-[0.2em]">Based on 2,840 reviews</p>
          </div>
          
          {reviews.map((review, i) => (
            <div key={i} className="p-10 border border-white/5 bg-black/30 rounded-2xl italic font-light font-serif">
              <div className="flex gap-1 mb-6 text-white/40">
                {[...Array(review.rating)].map((_, j) => <Star key={j} size={12} fill="currentColor" />)}
              </div>
              <p className="text-lg text-white/60 mb-8 leading-relaxed">"{review.text}"</p>
              <div className="not-italic font-headline">
                <h5 className="font-bold text-sm tracking-widest">{review.name}</h5>
                <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">{review.flavor}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  const faqs = [
    { q: "Are OLLANHO juices 100% real fruit?", a: "Yes. Every bottle is cold-pressed from whole, real fruit. We never use concentrates, artificial flavoring, or fillers. What you taste is exactly what's in the bottle." },
    { q: "Is there added sugar in the juice?", a: "No added sugar at all. The sweetness in every bottle comes entirely from the natural fruit sugars. We believe real fruit is sweet enough on its own." },
    { q: "How long does a bottle stay fresh?", a: "Our HPP (High Pressure Processing) technique extends shelf life to 60 days refrigerated, without any preservatives. Once opened, enjoy within 3 days for best taste." },
    { q: "Do you ship nationwide?", a: "Yes! We ship cold-packed in insulated boxes across the country. Orders typically arrive within 2 business days." },
  ];

  return (
    <section id="faq" className="py-32 bg-black">
      <div className="container mx-auto px-6 md:px-24 max-w-4xl">
        <div className="mb-20">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] mb-4">QUESTIONS</p>
          <h2 className="text-5xl md:text-7xl font-headline font-bold">FREQUENTLY ASKED</h2>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-white/10 px-0">
              <AccordionTrigger className="text-xl font-headline font-bold hover:no-underline hover:text-white/60 transition-colors py-8 uppercase tracking-widest text-left">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-white/40 text-lg pb-8 leading-relaxed font-light">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="py-24 bg-black border-t border-white/5">
      <div className="container mx-auto px-6 md:px-24">
        <div className="grid md:grid-cols-4 gap-20 mb-20 pb-20 border-b border-white/5">
          <div className="col-span-2">
            <h2 className="text-4xl font-headline font-bold tracking-[0.3em] mb-4">OLLANHO</h2>
            <p className="text-white/20 text-xs uppercase tracking-[0.4em]">Fresh Cold-Pressed Juice</p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] mb-8">Navigate</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
              <li><a href="#product" className="hover:text-white transition-colors">Product</a></li>
              <li><a href="#ingredients" className="hover:text-white transition-colors">Ingredients</a></li>
              <li><a href="#nutrition" className="hover:text-white transition-colors">Nutrition</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">Reviews</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] mb-8">Contact</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
              <li>hello@ollanho.com</li>
              <li>+1 (800) 555-JUICE</li>
              <li>Find a Store</li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">
          <p>© 2025 OLLANHO Fresh Juice. All rights reserved.</p>
          <div className="flex gap-12">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}