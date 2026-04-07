"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Star, Leaf, Waves, ShieldCheck, Droplets, Zap, Wind, Plus } from "lucide-react";
import { flavors } from "@/lib/flavor-data";
import Image from "next/image";
import { useUser, useFirestore } from "@/firebase";
import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export function IngredientsSection() {
  const ingredients = [
    { name: "Real Fruits", benefit: "100% cold-pressed whole fruits. No concentrates or artificial flavoring.", icon: Leaf },
    { name: "Pure Water", benefit: "Triple-filtered spring water for a perfectly clean finish.", icon: Waves },
    { name: "No Additives", benefit: "Zero artificial colors, flavors, or preservatives. Just fruit.", icon: ShieldCheck },
    { name: "Natural Sweetness", benefit: "Sweetened only with the natural sugars found in the fruit itself.", icon: Droplets },
    { name: "Vitamins", benefit: "Rich in Vitamin C, antioxidants, and natural electrolytes.", icon: Zap },
    { name: "Cold-Pressed", benefit: "HPP processing preserves nutrients and flavor at their peak.", icon: Wind },
  ];

  return (
    <section id="ingredients" className="py-24 bg-neutral-900/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-12 text-center md:text-left">
          <p className="text-white/30 text-[9px] uppercase tracking-[0.4em] mb-3">WHAT'S INSIDE</p>
          <h2 className="text-2xl md:text-4xl font-headline font-bold leading-tight uppercase">REAL INGREDIENTS<br />REAL BENEFITS</h2>
          <p className="text-white/40 mt-4 max-w-xl font-light text-xs md:text-sm">Every drop starts with real, whole fruits. No concentrates, no preservatives — just nature in a bottle.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ingredients.map((item) => (
            <div key={item.name} className="p-8 border border-white/5 bg-black/40 rounded-2xl hover:border-white/20 transition-all duration-500 group">
              <div className="mb-5 text-white/40 group-hover:text-white transition-colors">
                <item.icon size={24} strokeWidth={1} />
              </div>
              <h4 className="text-sm font-headline font-bold mb-3 tracking-widest uppercase">{item.name}</h4>
              <p className="text-[11px] text-white/30 leading-relaxed font-light">{item.benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductCollection() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const handleAddToCart = async (flavorId: string, flavorName: string) => {
    if (!user || !db) {
      toast({ title: "Please sign in to shop", description: "You need an account to add items to cart." });
      return;
    }

    try {
      const cartItemsRef = collection(db, "users", user.uid, "cart", "cart", "items");
      const q = query(cartItemsRef, where("productId", "==", flavorId));
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
          productId: flavorId,
          quantity: 1,
          priceAtAddToCart: 12,
          cartId: 'cart'
        });
      }
      toast({ title: `${flavorName} added to cart.` });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  };

  return (
    <section id="product" className="py-24 bg-black">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-12 text-center md:text-left">
          <p className="text-white/30 text-[9px] uppercase tracking-[0.4em] mb-3">OUR COLLECTION</p>
          <h2 className="text-2xl md:text-4xl font-headline font-bold leading-tight uppercase">SEVEN FLAVORS<br />ONE OBSESSION</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flavors.map((flavor) => (
            <div key={flavor.id} className="group relative">
               <div className="aspect-[4/5] rounded-2xl bg-neutral-950 border border-white/5 overflow-hidden p-6 mb-4 flex flex-col items-center justify-center group-hover:border-white/10 transition-all duration-700">
                  <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-700">
                    <Image 
                      src={flavor.imageUrl} 
                      alt={flavor.name} 
                      fill 
                      className="object-contain p-2"
                    />
                  </div>
                  <button 
                    onClick={() => handleAddToCart(flavor.id, flavor.name)}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl"
                  >
                    <Plus size={18} />
                  </button>
               </div>
               <div className="text-center md:text-left">
                 <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/80 mb-1">
                   {flavor.name}
                 </h4>
                 <p className="text-[8px] text-white/30 uppercase tracking-widest">$12.00 — 350ml</p>
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
    <section id="nutrition" className="py-24 bg-black border-y border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-20 items-start">
          <div className="p-8 border-[2px] border-white rounded-md max-w-[340px] mx-auto md:mx-0 shadow-[0_0_40px_rgba(255,255,255,0.02)]">
            <h3 className="text-3xl font-bold font-headline border-b-[8px] border-white pb-1 mb-2 leading-none uppercase">Nutrition</h3>
            <p className="text-[9px] uppercase tracking-widest text-white/40 border-b border-white/20 pb-2 mb-4">Serving Size: 1 Bottle (350ml)</p>
            <div className="flex justify-between items-end border-b-4 border-white pb-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest">Calories</span>
              <span className="text-4xl md:text-5xl font-bold leading-none font-headline">110</span>
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
              <div key={row.label} className={`flex justify-between py-2 border-b border-white/10 text-[10px] uppercase tracking-widest ${row.highlight ? 'font-bold text-white' : 'text-white/60'}`}>
                <span className={row.indent ? 'pl-4' : ''}>{row.label}</span>
                <span>{row.val}</span>
              </div>
            ))}
            <p className="text-[8px] text-white/30 mt-4 leading-tight italic uppercase">
              * Percent daily values are based on a 2,000 calorie diet.
            </p>
          </div>
          
          <div className="space-y-12">
            <h2 className="text-2xl md:text-5xl font-headline font-bold leading-[0.9] tracking-tighter uppercase">NUTRITION<br />YOU CAN FEEL.</h2>
            <div className="grid gap-6">
              {[
                { num: "01", title: "Immune Support", desc: "High Vitamin C content from real fruits helps strengthen your immune system naturally." },
                { num: "02", title: "Antioxidant Rich", desc: "Natural antioxidants from whole fruits combat free radicals and support cellular health." },
                { num: "03", title: "Hydration Boost", desc: "Natural electrolytes and water content keep you hydrated throughout the day." },
                { num: "04", title: "No Added Sugar", desc: "Every gram of sweetness comes directly from the fruits — nothing added, nothing artificial." },
              ].map((item) => (
                <div key={item.num} className="flex gap-6 items-start border-l border-white/10 pl-6 group">
                  <span className="text-xl font-headline font-bold text-white/10 group-hover:text-white/40 transition-colors duration-500">{item.num}</span>
                  <div>
                    <h4 className="text-[11px] font-bold mb-1 uppercase tracking-[0.2em]">{item.title}</h4>
                    <p className="text-white/40 font-light leading-relaxed text-[10px]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  const reviews = [
    { name: "Sarah M.", flavor: "Guava Juice", rating: 5, text: "The guava flavor is absolutely incredible. Tastes exactly like fresh-cut fruits — I can't believe it comes in a bottle." },
    { name: "James K.", flavor: "Apple Juice", rating: 5, text: "Apple is my go-to every morning. Clean ingredients, no guilt, just pure delicious fruit juice." },
    { name: "Priya L.", flavor: "Pineapple Juice", rating: 5, text: "Finally a juice brand that actually tastes fresh. The pineapple is my personal favorite — tropical and perfect." },
    { name: "Marcus T.", flavor: "Grape Juice", rating: 5, text: "The grape juice converted me. Deep, rich flavor — nothing like the sugary stuff. Will subscribe for life." },
  ];

  return (
    <section id="reviews" className="py-24 bg-neutral-900/20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-12 text-center">
          <p className="text-white/30 text-[9px] uppercase tracking-[0.4em] mb-3">WHAT PEOPLE SAY</p>
          <h2 className="text-2xl md:text-4xl font-headline font-bold uppercase">LOVED BY THOUSANDS</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-black/40 p-10 rounded-3xl border border-white/5 text-center flex flex-col justify-center items-center backdrop-blur-sm">
            <span className="text-5xl md:text-6xl font-headline font-bold">4.9</span>
            <div className="flex gap-1 my-4 text-white/80">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <p className="text-[9px] text-white/30 uppercase tracking-[0.3em]">Based on 2,840 reviews</p>
          </div>
          
          {reviews.map((review, i) => (
            <div key={i} className="p-8 border border-white/5 bg-black/20 rounded-3xl group hover:border-white/20 transition-all duration-500">
              <div className="flex gap-1 mb-6 text-white/20 group-hover:text-white/60 transition-colors">
                {[...Array(review.rating)].map((_, j) => <Star key={j} size={11} fill="currentColor" />)}
              </div>
              <p className="text-[13px] text-white/60 mb-6 leading-relaxed font-light italic">"{review.text}"</p>
              <div className="mt-auto">
                <h5 className="font-bold text-[10px] tracking-widest uppercase">{review.name}</h5>
                <p className="text-[8px] text-white/20 uppercase tracking-widest mt-1">{review.flavor}</p>
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
    <section id="faq" className="py-24 bg-black">
      <div className="container mx-auto px-6 md:px-12 max-w-2xl">
        <div className="mb-12 text-center md:text-left">
          <p className="text-white/30 text-[9px] uppercase tracking-[0.4em] mb-3">QUESTIONS</p>
          <h2 className="text-2xl md:text-4xl font-headline font-bold uppercase">FREQUENTLY ASKED</h2>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-white/5 px-0">
              <AccordionTrigger className="text-xs md:text-sm font-headline font-bold hover:no-underline hover:text-white/60 transition-colors py-6 uppercase tracking-widest text-left">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-white/40 text-xs pb-6 leading-relaxed font-light">
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
    <footer className="py-20 bg-black border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-16 mb-16 pb-16 border-b border-white/5">
          <div className="col-span-2">
            <h2 className="text-2xl font-headline font-bold tracking-[0.3em] mb-4">OLLANHO</h2>
            <p className="text-white/20 text-[9px] uppercase tracking-[0.4em]">Fresh Cold-Pressed Juice</p>
          </div>
          <div>
            <h4 className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] mb-8">Navigate</h4>
            <ul className="space-y-4 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
              <li><a href="#product" className="hover:text-white transition-colors">Product</a></li>
              <li><a href="#ingredients" className="hover:text-white transition-colors">Ingredients</a></li>
              <li><a href="#nutrition" className="hover:text-white transition-colors">Nutrition</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">Reviews</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] mb-8">Contact</h4>
            <ul className="space-y-4 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
              <li>hello@ollanho.com</li>
              <li>+1 (800) 555-JUICE</li>
              <li>Find a Store</li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[8px] text-white/20 uppercase tracking-[0.4em] font-bold">
          <p>© 2025 OLLANHO Fresh Juice. All rights reserved.</p>
          <div className="flex gap-12">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}