"use client";

import { Star } from "lucide-react";

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
            <div key={i} className="p-8 bg-black/20 rounded-3xl group hover:border-primary transition-all duration-500 shadow-lg primary-glow-border">
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
