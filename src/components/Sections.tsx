"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Check, Star, Droplets, Leaf, Zap, ShieldCheck, Waves, Wind } from "lucide-react";
import { flavors } from "@/lib/flavor-data";
import Image from "next/image";

export function IngredientsSection() {
  const ingredients = [
    { name: "Real Fruits", benefit: "Naturally sourced flavors from whole fruits", icon: Leaf },
    { name: "Pure Water", benefit: "Pure hydration with a refreshing fizz", icon: Waves },
    { name: "No Additives", benefit: "Zero artificial colors, flavors, or secrets", icon: ShieldCheck },
    { name: "Natural Sweetness", benefit: "Balanced with plant-based stevia and inulin", icon: Droplets },
    { name: "Vitamins & Prebiotics", benefit: "Gut health support with functional roots", icon: Zap },
    { name: "Cold Pressed", benefit: "Preserving nutrient density in every can", icon: Wind },
  ];

  return (
    <section id="ingredients" className="py-32 bg-black relative z-10 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-headline font-bold mb-10 tracking-tighter uppercase">
              PURELY <br /><span className="text-primary">PLANT POWERED.</span>
            </h2>
            <p className="text-white/50 mb-12 max-w-md text-lg leading-relaxed">
              We ditched the chemistry set. Every Olipop is crafted with botanicals, plant fibers, and prebiotics to create a functional soda that loves you back.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {ingredients.map((item) => (
                <div key={item.name} className="group">
                  <div className="mb-4 p-3 w-fit bg-white/5 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-1">{item.name}</h4>
                    <p className="text-xs text-white/40 leading-relaxed">{item.benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 group">
            <Image 
              src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop" 
              alt="Natural Forest" 
              fill
              className="object-cover opacity-60 scale-100 group-hover:scale-105 transition-transform duration-1000 grayscale hover:grayscale-0"
              data-ai-hint="botanical garden"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-10 left-10 p-8 backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl">
               <p className="text-3xl font-headline font-bold text-white mb-2">35-50</p>
               <p className="text-[10px] uppercase tracking-widest text-primary font-bold">CALORIES PER CAN</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductCollection() {
  return (
    <section className="py-32 bg-neutral-950 border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
           <div>
              <p className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-4">Functional Flavors</p>
              <h2 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter uppercase">The Complete <br />Odyssey.</h2>
           </div>
           <p className="text-white/40 max-w-sm text-sm mt-6 md:mt-0">Seven unique flavors, one shared mission: to support your digestive health with every refreshing sip.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {flavors.map((flavor) => (
            <div key={flavor.id} className="group relative">
               <div 
                 className="aspect-[2/3] rounded-3xl bg-neutral-900 overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-700 p-6 flex flex-col items-center justify-between"
               >
                  <div className="relative w-full h-full transform group-hover:-translate-y-4 transition-transform duration-700">
                    <Image 
                      src={flavor.imageUrl} 
                      alt={flavor.name} 
                      fill 
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center w-full">
                    <h4 className="text-sm font-headline font-bold uppercase tracking-widest">{flavor.name}</h4>
                    <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] mt-1">{flavor.color}</p>
                  </div>
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700"
                    style={{ background: `radial-gradient(circle at center, ${flavor.hex}, transparent 70%)` }}
                  />
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NutritionSection() {
  return (
    <section id="nutrition" className="py-32 bg-black relative z-10">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
             <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Sugars", val: "2-5g", sub: "Natural" },
                  { label: "Fiber", val: "9g", sub: "Prebiotic" },
                  { label: "Calories", val: "35-50", sub: "Light" },
                  { label: "Ingredients", val: "Plant", sub: "Botanical" },
                ].map((stat) => (
                  <div key={stat.label} className="p-8 border border-white/5 rounded-3xl bg-neutral-900/50 backdrop-blur-sm">
                    <p className="text-white/30 text-[9px] uppercase tracking-[0.3em] mb-3">{stat.label}</p>
                    <h3 className="text-4xl font-headline font-bold text-white mb-2">{stat.val}</h3>
                    <div className="h-0.5 w-8 bg-primary mb-2" />
                    <p className="text-primary text-[10px] font-bold uppercase tracking-widest">{stat.sub}</p>
                  </div>
                ))}
             </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-5xl md:text-7xl font-headline font-bold mb-8 uppercase tracking-tighter">NUTRITION <br />YOU CAN <br /><span className="text-primary">FEEL.</span></h2>
            <p className="text-white/50 text-lg leading-relaxed mb-10">
              Forget everything you know about soda. We've packed 9g of dietary fiber into every can to support a healthy microbiome, while keeping sugar to a minimum.
            </p>
            <button className="px-10 py-5 border border-white/10 text-white font-bold rounded-full uppercase tracking-widest text-[11px] hover:bg-primary hover:border-primary transition-all">
              Compare with others
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  const reviews = [
    { name: "Sarah J.", rating: 5, text: "The Guava flavor is literally life-changing. I can't believe it only has 3g of sugar!" },
    { name: "Marcus T.", rating: 5, text: "Finally, a soda that doesn't make me feel bloated. Strawberry is my go-to." },
    { name: "Elena R.", rating: 4, text: "Love the brand aesthetic and the flavors are spot on. Can't wait for more variants." },
  ];

  return (
    <section id="reviews" className="py-32 bg-neutral-950 relative z-10 border-t border-white/5">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-headline font-bold text-center mb-20 uppercase tracking-tighter">THE VERDICT</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <Card key={i} className="bg-neutral-900 border-white/5 p-4 rounded-[2rem] hover:border-primary/50 transition-colors duration-500">
              <CardHeader>
                <div className="flex gap-1 mb-6 text-primary">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} size={14} fill="currentColor" />
                  ))}
                </div>
                <CardTitle className="text-xl font-headline font-bold">{review.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/50 text-base leading-relaxed italic">"{review.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  const faqs = [
    { q: "What are prebiotics?", a: "Prebiotics are a type of fiber that feed the good bacteria in your gut. We use roots like Chicory and Jerusalem Artichoke to provide high-quality fiber." },
    { q: "Is Olipop gluten-free?", a: "Yes, all of our flavors are certified gluten-free, non-GMO, vegan, and paleo-friendly." },
    { q: "How much sugar is in each can?", a: "Most of our flavors contain between 2g and 5g of natural sugar, mostly from real fruit juice." },
  ];

  return (
    <section id="faq" className="py-32 bg-black relative z-10 border-t border-white/5">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-5xl font-headline font-bold text-center mb-16 uppercase tracking-tighter">COMMON CURIOSITIES</h2>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-white/10 px-8 bg-neutral-900/30 rounded-3xl overflow-hidden">
              <AccordionTrigger className="text-lg font-headline font-bold hover:no-underline hover:text-primary transition-colors py-6">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-white/40 text-base pb-6 leading-relaxed">
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
    <footer className="py-32 bg-black border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-2">
            <h2 className="text-4xl font-headline font-bold tracking-tighter mb-8 uppercase">OLIPOP<span className="text-primary">.</span></h2>
            <p className="text-white/30 max-w-sm mb-10 text-base leading-relaxed">Elevating the classic soda experience with functional ingredients that support your digestive health.</p>
            <div className="flex gap-8">
              {["Instagram", "TikTok", "X", "YouTube"].map(social => (
                <a key={social} href="#" className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 hover:text-white transition-colors">{social}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-8 uppercase text-[11px] tracking-[0.3em] text-primary">Explore</h4>
            <ul className="space-y-4 text-sm text-white/40 font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:text-white transition-colors">Our Mission</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Flavor Science</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Store Locator</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-8 uppercase text-[11px] tracking-[0.3em] text-primary">Privacy</h4>
            <ul className="space-y-4 text-sm text-white/40 font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-white/20 font-bold uppercase tracking-[0.3em]">
          <p>© {new Date().getFullYear()} Olipop Odyssey. All rights reserved.</p>
          <div className="flex gap-8">
             <span>Crafted with plants</span>
             <span>Cold Pressed Science</span>
          </div>
        </div>
      </div>
    </footer>
  );
}