
"use client";

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, limit, orderBy } from "firebase/firestore";
import { Star, Loader2 } from "lucide-react";

export function ReviewsSection() {
  const db = useFirestore();

  const latestReviewsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, "reviews"),
      orderBy("timestamp", "desc"),
      limit(4)
    );
  }, [db]);

  const { data: reviews, isLoading } = useCollection(latestReviewsQuery);

  return (
    <section id="reviews" className="py-24 bg-neutral-900/20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16 text-center">
          <p className="text-primary text-[9px] lowercase tracking-[0.4em] mb-3 font-medium">what people say</p>
          <h2 className="text-2xl md:text-3xl font-headline font-bold uppercase">Loved By Thousands</h2>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-20">
            <Loader2 className="animate-spin text-primary/20" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-black/40 p-10 rounded-3xl border border-primary/10 text-center flex flex-col justify-center items-center backdrop-blur-sm shadow-xl">
              <span className="text-4xl md:text-5xl font-headline font-bold text-primary">4.9</span>
              <div className="flex gap-1.5 my-3 text-primary">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-[9px] text-white/30 uppercase tracking-[0.3em]">Based on thousands of bottles</p>
            </div>
            
            {reviews && reviews.map((review) => (
              <div key={review.id} className="p-8 bg-black/20 rounded-3xl group hover:border-primary transition-all duration-500 shadow-lg primary-glow-border">
                <div className="flex gap-1 mb-5 text-primary/20 group-hover:text-primary transition-colors">
                  {[...Array(review.rating || 5)].map((_, j) => <Star key={j} size={10} fill="currentColor" />)}
                </div>
                <p className="text-[12px] text-white/50 mb-6 leading-relaxed font-light italic truncate-3-lines">
                  "{review.comment}"
                </p>
                <div className="mt-auto pt-4 border-t border-white/5">
                  <h5 className="font-bold text-[10px] tracking-widest uppercase">{review.userName || 'Valued Member'}</h5>
                  <p className="text-[9px] text-primary uppercase tracking-widest mt-1">Nectar Enthusiast</p>
                </div>
              </div>
            ))}

            {!reviews?.length && !isLoading && (
              <div className="col-span-3 flex items-center justify-center p-12 border border-dashed border-white/10 rounded-3xl opacity-30">
                <p className="text-[10px] uppercase tracking-widest">Awaiting the first harvest review...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
