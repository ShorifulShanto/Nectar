"use client";

import { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Star, Leaf, Waves, ShieldCheck, Droplets, Zap, Wind, Plus, Send, RefreshCw } from "lucide-react";
import { flavors } from "@/lib/flavor-data";
import Image from "next/image";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, setDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function IngredientsSection() {
  const ingredients = [
    { name: "Real Fruits", benefit: "100% cold-pressed whole fruits. No concentrates or artificial flavoring.", icon: Leaf },
    { name: "Pure Water", benefit: "Triple-filtered spring water for a perfectly clean finish.", icon: Waves },
    { name: "No Additives", benefit: "Zero artificial colors, flavors, or preservatives. Just pure juice.", icon: ShieldCheck },
    { name: "Natural Sweetness", benefit: "Sweetened only with the natural sugars found in the fruit itself.", icon: Droplets },
    { name: "Vitamins", benefit: "Rich in Vitamin C, antioxidants, and natural fruit electrolytes.", icon: Zap },
    { name: "Cold-Pressed", benefit: "HPP processing preserves nutrients and flavor at their absolute peak.", icon: Wind },
  ];

  return (
    <section id="ingredients" className="py-24 bg-neutral-900/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16 text-center md:text-left">
          <p className="text-primary text-[9px] lowercase tracking-[0.4em] mb-3 font-medium">what's inside</p>
          <h2 className="text-3xl md:text-4xl font-headline font-bold leading-tight uppercase">Real Ingredients<br /><span className="text-primary">Real Benefits</span></h2>
          <p className="text-white/40 mt-4 max-w-lg font-light text-[11px] md:text-sm">Every drop starts with real, whole fruits. No concentrates, no preservatives — just nature in a bottle.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ingredients.map((item) => (
            <div key={item.name} className="p-8 bg-black/40 rounded-2xl transition-all duration-500 group maroon-glow-border">
              <div className="mb-4 text-primary transition-colors">
                <item.icon size={22} strokeWidth={1.5} />
              </div>
              <h4 className="text-[12px] font-headline font-bold mb-2 tracking-widest uppercase">{item.name}</h4>
              <p className="text-[10px] text-white/30 leading-relaxed font-light">{item.benefit}</p>
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

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "products");
  }, [db]);

  const { data: dbProducts, isLoading } = useCollection(productsQuery);

  const handleAddToCart = async (productId: string, productName: string, price: number, isSoldOut: boolean) => {
    if (!user || !db) {
      toast({ title: "Please sign in to shop", description: "You need an account to add items to cart." });
      return;
    }

    if (isSoldOut) {
      toast({ variant: "destructive", title: "Sold Out", description: "This flavor is currently unavailable." });
      return;
    }

    try {
      const cartItemsRef = collection(db, "users", user.uid, "cart", "cart", "items");
      const q = query(cartItemsRef, where("productId", "==", productId));
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
          productId: productId,
          quantity: 1,
          priceAtAddToCart: price,
          cartId: 'cart'
        });
      }

      const hubRef = doc(collection(db, "central_hub"));
      await setDoc(hubRef, {
        id: hubRef.id,
        type: "cart_addition",
        userId: user.uid,
        userEmail: user.email,
        payload: { productId, flavorName: productName },
        timestamp: new Date().toISOString(),
        createdAt: serverTimestamp()
      });

      toast({ title: `${productName} added to cart.` });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  };

  return (
    <section id="product" className="py-24 bg-black">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16 text-center md:text-left">
          <p className="text-primary text-[9px] lowercase tracking-[0.4em] mb-3 font-medium">our collection</p>
          <h2 className="text-2xl md:text-3xl font-headline font-bold leading-tight uppercase">Discover Our<br />Latest Batch</h2>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <RefreshCw className="animate-spin text-primary/10" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {dbProducts && dbProducts.length > 0 ? (
              dbProducts.map((product) => {
                const isSoldOut = product.amount <= 0;
                const price = product.price || 12.00;
                const flavorConfig = flavors.find(f => f.id === product.id);
                const accentColor = flavorConfig?.accentHex || '#ffffff';

                return (
                  <div key={product.id} className="group relative flex flex-col items-center sm:items-start">
                     <div className="aspect-square w-full max-w-[320px] rounded-[2.5rem] bg-neutral-950 border border-white/5 overflow-hidden p-10 mb-6 flex flex-col items-center justify-center group-hover:border-primary/20 transition-all duration-700 shadow-2xl relative">
                        {/* Dynamic Glow Background */}
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-700 blur-[40px] pointer-events-none"
                          style={{ background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 70%)` }}
                        />
                        
                        {isSoldOut && (
                          <div className="absolute top-4 left-4 z-10 bg-primary text-white text-[8px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                            Sold Out
                          </div>
                        )}
                        <div className={`relative w-full h-full transform group-hover:scale-110 transition-transform duration-700 ${isSoldOut ? 'grayscale opacity-50' : ''}`}>
                          <Image 
                            src={product.image || flavorConfig?.imageUrl || 'https://picsum.photos/seed/juice/400/600'} 
                            alt={product.name} 
                            fill 
                            className="object-contain"
                          />
                        </div>
                        {!isSoldOut && (
                          <button 
                            onClick={() => handleAddToCart(product.id, product.name, price, isSoldOut)}
                            className="absolute bottom-6 right-6 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-2xl z-20 hover:scale-110"
                          >
                            <Plus size={20} />
                          </button>
                        )}
                     </div>
                     <div className="text-center sm:text-left px-2">
                       <h4 className={`text-[11px] font-bold tracking-[0.3em] uppercase mb-1 transition-colors ${isSoldOut ? 'text-white/20' : 'text-white/90 group-hover:text-primary'}`}>
                         {product.name}
                       </h4>
                       <p className="text-[9px] text-white/30 uppercase tracking-[0.4em] font-medium">
                         ${price.toFixed(2)} — 350ml
                       </p>
                     </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-24 text-center border border-dashed border-white/10 rounded-[3rem] bg-neutral-950/50">
                <p className="text-white/20 uppercase tracking-[0.5em] text-[10px]">Catalog is being harvested...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export function NutritionSection() {
  return (
    <section id="nutrition" className="py-24 bg-black border-y border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="p-8 border-[1px] border-primary rounded-sm max-w-[320px] mx-auto md:mx-0 shadow-2xl bg-neutral-950/50">
            <h3 className="text-2xl font-bold font-headline border-b-[6px] border-primary pb-2 mb-3 leading-none uppercase text-primary">Nutrition Facts</h3>
            <p className="text-[9px] uppercase tracking-widest text-white/40 border-b border-white/20 pb-3 mb-4 font-bold">Serving Size: 1 Bottle (350ml)</p>
            <div className="flex justify-between items-end border-b-[3px] border-primary pb-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest">Calories</span>
              <span className="text-4xl font-bold leading-none font-headline text-primary">110</span>
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
              <div key={row.label} className={`flex justify-between py-1.5 border-b border-white/10 text-[9px] uppercase tracking-widest ${row.highlight ? 'font-bold text-primary' : 'text-white/50'}`}>
                <span className={row.indent ? 'pl-4' : ''}>{row.label}</span>
                <span>{row.val}</span>
              </div>
            ))}
            <p className="text-[8px] text-white/20 mt-4 leading-tight italic uppercase tracking-wider font-light">
              * Percent daily values are based on a 2,000 calorie diet.
            </p>
          </div>
          
          <div className="space-y-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold leading-[0.9] tracking-tighter uppercase">Nutrition<br /><span className="text-primary">You Can Feel.</span></h2>
            <div className="grid gap-6">
              {[
                { num: "01", title: "Immune Support", desc: "High Vitamin C content from real fruits helps strengthen your immune system naturally." },
                { num: "02", title: "Antioxidant Rich", desc: "Natural antioxidants from whole fruits combat free radicals and support cellular health." },
                { num: "03", title: "Hydration Boost", desc: "Natural electrolytes and pure water content keep you hydrated throughout the day." },
                { num: "04", title: "No Added Sugar", desc: "Every gram of sweetness comes directly from the fruits — nothing added, nothing artificial." },
              ].map((item) => (
                <div key={item.num} className="flex gap-6 items-start border-l border-primary/20 pl-6 group">
                  <span className="text-2xl font-headline font-bold text-primary/10 group-hover:text-primary transition-colors duration-500">{item.num}</span>
                  <div>
                    <h4 className="text-[11px] font-bold mb-1 uppercase tracking-[0.2em]">{item.title}</h4>
                    <p className="text-white/40 font-light leading-relaxed text-[10px] max-w-sm">{item.desc}</p>
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
        <div className="mb-16 text-center">
          <p className="text-primary text-[9px] lowercase tracking-[0.4em] mb-3 font-medium">what people say</p>
          <h2 className="text-2xl md:text-3xl font-headline font-bold uppercase">Loved By Thousands</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-black/40 p-10 rounded-3xl border border-primary/10 text-center flex flex-col justify-center items-center backdrop-blur-sm shadow-xl">
            <span className="text-4xl md:text-5xl font-headline font-bold text-primary">4.9</span>
            <div className="flex gap-1.5 my-3 text-primary">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <p className="text-[9px] text-white/30 uppercase tracking-[0.3em]">Based on 2,840 reviews</p>
          </div>
          
          {reviews.map((review, i) => (
            <div key={i} className="p-8 bg-black/20 rounded-3xl group hover:border-primary transition-all duration-500 shadow-lg maroon-glow-border">
              <div className="flex gap-1 mb-5 text-primary/20 group-hover:text-primary transition-colors">
                {[...Array(review.rating)].map((_, j) => <Star key={j} size={10} fill="currentColor" />)}
              </div>
              <p className="text-[12px] text-white/50 mb-6 leading-relaxed font-light italic">"{review.text}"</p>
              <div className="mt-auto pt-4 border-t border-white/5">
                <h5 className="font-bold text-[10px] tracking-widest uppercase">{review.name}</h5>
                <p className="text-[9px] text-primary uppercase tracking-widest mt-1">{review.flavor}</p>
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
    { q: "Are Olipop juices 100% real fruit?", a: "Yes. Every bottle is cold-pressed from whole, real fruit. We never use concentrates, artificial flavoring, or fillers." },
    { q: "Is there added sugar in the juice?", a: "No added sugar at all. The sweetness in every bottle comes entirely from the natural fruit sugars." },
    { q: "How long does a bottle stay fresh?", a: "Our HPP technique extends shelf life to 60 days refrigerated. Once opened, enjoy within 3 days for best taste." },
    { q: "Do you ship nationwide?", a: "Yes! We ship cold-packed in insulated boxes across the country. Orders typically arrive within 2 business days." },
  ];

  return (
    <section id="faq" className="py-24 bg-black">
      <div className="container mx-auto px-6 md:px-12 max-w-2xl">
        <div className="mb-12 text-center md:text-left">
          <p className="text-primary text-[9px] lowercase tracking-[0.4em] mb-3 font-medium">questions</p>
          <h2 className="text-2xl md:text-3xl font-headline font-bold uppercase">Frequently Asked</h2>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-white/5 px-0 bg-neutral-900/20 rounded-xl px-6">
              <AccordionTrigger className="text-[11px] md:text-sm font-headline font-bold hover:no-underline hover:text-primary transition-colors py-5 uppercase tracking-widest text-left">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-white/40 text-[11px] pb-5 leading-relaxed font-light border-t border-white/5 pt-4">
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
  const [email, setEmail] = useState("");
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !db) return;

    try {
      const entryRef = doc(collection(db, "central_hub"));
      await setDoc(entryRef, {
        id: entryRef.id,
        type: "newsletter",
        userId: user?.uid || "anonymous",
        userEmail: email,
        timestamp: new Date().toISOString(),
        createdAt: serverTimestamp()
      });
      setEmail("");
      toast({ title: "Subscribed successfully!" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  };

  return (
    <footer className="py-20 bg-black border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-16 mb-16 pb-16 border-b border-white/5">
          <div className="col-span-2">
            <h2 className="text-3xl font-headline font-bold tracking-[0.3em] mb-4 text-primary">Olipop</h2>
            <p className="text-white/20 text-[10px] lowercase tracking-[0.4em] mb-8 font-medium">Fresh Cold-Pressed Juice</p>
            <div className="max-w-sm">
              <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4">Newsletter Signup</h4>
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <Input 
                  placeholder="your@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-neutral-900 border-white/5 text-[10px] tracking-widest"
                />
                <Button type="submit" size="icon" className="bg-primary text-white hover:bg-primary/80">
                  <Send size={16} />
                </Button>
              </form>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-6">Navigate</h4>
            <ul className="space-y-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              <li><a href="#product" className="hover:text-primary transition-colors">Product</a></li>
              <li><a href="#ingredients" className="hover:text-primary transition-colors">Ingredients</a></li>
              <li><a href="#nutrition" className="hover:text-primary transition-colors">Nutrition</a></li>
              <li><a href="#reviews" className="hover:text-primary transition-colors">Reviews</a></li>
              <li><a href="/admin-dashboard" className="hover:text-primary transition-colors text-white/20">Admin Hub</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-6">Contact</h4>
            <ul className="space-y-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              <li>hello@olipop.com</li>
              <li>+1 (800) 555-JUICE</li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] text-white/20 lowercase tracking-[0.4em] font-bold">
          <p>© 2025 Olipop Fresh Juice. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
