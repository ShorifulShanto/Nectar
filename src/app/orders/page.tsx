
"use client";

import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  ShoppingBag, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Loader2, 
  ArrowLeft,
  Star,
  MessageSquare,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { generateReview } from "@/ai/flows/generate-review-flow";

export default function OrdersPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [selectedProduct, setSelectedProduct] = useState<{id: string, name: string} | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Removed server-side orderBy to avoid potential permission/index issues
  const ordersQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, "orders"),
      where("userId", "==", user.uid)
    );
  }, [db, user]);

  const { data: rawOrders, isLoading } = useCollection(ordersQuery);

  // Perform sorting in memory for reliable real-time updates without index requirements
  const sortedOrders = useMemo(() => {
    if (!rawOrders) return null;
    return [...rawOrders].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [rawOrders]);

  const handleAiDraft = async () => {
    if (!selectedProduct) return;
    setIsAiGenerating(true);
    try {
      const response = await generateReview({
        productName: selectedProduct.name,
        rating: rating
      });
      setComment(response.review);
      toast({ title: "AI Draft Complete", description: "Tasting notes generated based on your rating." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "AI Draft Failed", description: "Could not connect to NECTAR AI." });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleReviewSubmit = () => {
    if (!user || !db || !selectedProduct) return;
    setIsSubmitting(true);

    const reviewRef = collection(db, "reviews");
    addDocumentNonBlocking(reviewRef, {
      productId: selectedProduct.id,
      userId: user.uid,
      userName: user.email?.split('@')[0] || "Anonymous User",
      rating,
      comment,
      timestamp: new Date().toISOString()
    });

    const hubRef = collection(db, "central_hub");
    addDocumentNonBlocking(hubRef, {
      type: "review_submitted",
      userId: user.uid,
      userEmail: user.email,
      payload: { productId: selectedProduct.id, productName: selectedProduct.name, rating },
      timestamp: new Date().toISOString()
    });

    toast({ title: "Review Submitted", description: `Thank you for sharing your thoughts on ${selectedProduct.name}!` });
    
    setSelectedProduct(null);
    setRating(5);
    setComment("");
    setIsSubmitting(false);
  };

  if (isUserLoading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <ShoppingBag className="text-white/10 mb-6" size={64} />
        <h1 className="text-2xl font-headline font-bold uppercase mb-4">Please Sign In</h1>
        <p className="text-white/40 text-sm mb-8 uppercase tracking-widest">Sign in to view your order history.</p>
        <Button asChild className="rounded-full bg-white text-black hover:bg-neutral-200">
          <Link href="/auth">Continue to Login</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white/30 hover:text-white transition-all mb-8 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to the Grove
          </Link>
          <div>
            <p className="text-primary text-[9px] uppercase tracking-[0.5em] mb-4 font-bold">Your History</p>
            <h1 className="text-5xl font-headline font-bold uppercase tracking-tighter">My Orders</h1>
          </div>
        </div>

        {sortedOrders && sortedOrders.length > 0 ? (
          <div className="space-y-8">
            {sortedOrders.map((order) => (
              <div key={order.id} className="bg-neutral-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm group">
                <div className="p-6 md:p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/2">
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">{order.id}</p>
                    <p className="text-sm font-bold">{order.createdAt ? format(new Date(order.createdAt), "MMMM dd, yyyy 'at' h:mm a") : 'N/A'}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        {order.status === 'pending' && <Clock className="text-yellow-500" size={14} />}
                        {order.status === 'shipped' && <Truck className="text-blue-500" size={14} />}
                        {order.status === 'delivered' && <CheckCircle className="text-green-500" size={14} />}
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                          order.status === 'pending' ? 'text-yellow-500' :
                          order.status === 'shipped' ? 'text-blue-500' :
                          'text-green-500'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="h-10 w-px bg-white/5 hidden md:block" />
                    <div className="text-right">
                      <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Total</p>
                      <p className="text-xl font-headline font-bold text-primary">${(order.totalAmount || 0).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-bold">Included Items</p>
                      <div className="space-y-4">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-4 group/item">
                            <div className="w-12 h-12 bg-black/40 border border-white/5 rounded-xl overflow-hidden relative">
                              <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                            </div>
                            <div className="flex-1">
                              <p className="text-[11px] font-bold uppercase tracking-widest">{item.name}</p>
                              <p className="text-[10px] text-white/30 font-mono">Qty: {item.quantity} • ${item.price.toFixed(2)}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedProduct({ id: item.productId, name: item.name })}
                              className="text-[9px] uppercase tracking-widest text-white/20 hover:text-primary hover:bg-primary/10 rounded-full h-8"
                            >
                              <MessageSquare size={12} className="mr-2" />
                              Rate
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-bold">Shipping To</p>
                      <div className="bg-black/20 p-6 rounded-2xl border border-white/5 space-y-2">
                        <p className="text-[12px] font-bold uppercase tracking-widest">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                        <p className="text-[11px] text-white/40 font-light leading-relaxed">{order.shippingAddress?.location}</p>
                        <p className="text-[11px] text-white/30 font-mono">{order.shippingAddress?.phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center opacity-40">
            <ShoppingBag size={32} className="mb-6" />
            <h3 className="text-xl font-headline font-bold uppercase tracking-widest mb-4">No Orders Found</h3>
            <Button asChild variant="outline" className="rounded-full px-12 uppercase tracking-widest text-[10px]">
              <Link href="/">Explore Flavors</Link>
            </Button>
          </div>
        )}
      </div>

      <Footer />

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="bg-black/80 backdrop-blur-2xl border-white/10 text-white rounded-[2rem] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-headline uppercase tracking-widest mb-2">
              Rate {selectedProduct?.name}
            </DialogTitle>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Share your harvest experience</p>
          </DialogHeader>

          <div className="py-6 space-y-6">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                >
                  <Star 
                    size={32} 
                    className={`${star <= rating ? 'text-primary fill-primary' : 'text-white/10'}`} 
                  />
                </button>
              ))}
            </div>

            <div className="relative group">
              <Textarea 
                placeholder="Share your tasting notes..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="bg-white/5 border-white/10 text-sm min-h-[120px] rounded-2xl pr-12 focus:border-primary/50"
              />
              <button
                type="button"
                onClick={handleAiDraft}
                disabled={isAiGenerating}
                className="absolute bottom-4 right-4 text-primary/40 hover:text-primary transition-colors disabled:opacity-30"
                title="Draft with NECTAR AI"
              >
                {isAiGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              </button>
            </div>
          </div>

          <DialogFooter className="sm:flex-col gap-3">
            <Button 
              onClick={handleReviewSubmit}
              disabled={isSubmitting || !comment.trim()}
              className="w-full bg-white text-black hover:bg-neutral-200 rounded-full uppercase tracking-widest text-[11px] font-bold h-12"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Submit Review"}
            </Button>
            <Button
              variant="ghost"
              onClick={handleAiDraft}
              disabled={isAiGenerating}
              className="w-full text-primary uppercase tracking-widest text-[9px] font-bold flex items-center justify-center gap-2 hover:bg-primary/5 rounded-full"
            >
              <Sparkles size={14} />
              {isAiGenerating ? "Brewing Draft..." : "Draft with AI"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
