
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUser, useFirestore, useCollection, useDoc } from "@/firebase";
import { collection, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { flavors } from "@/lib/flavor-data";
import { Trash2, Plus, Minus, Truck, Info } from "lucide-react";
import Image from "next/image";
import { useMemoFirebase } from "@/firebase/provider";
import { useToast } from "@/hooks/use-toast";

export function CartSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const cartQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "users", user.uid, "cart", "cart", "items");
  }, [db, user]);

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);

  const { data: items, isLoading } = useCollection(cartQuery);
  const { data: profile } = useDoc(userRef);

  const updateQty = async (id: string, newQty: number) => {
    if (!user || !db) return;
    if (newQty < 1) {
      await deleteDoc(doc(db, "users", user.uid, "cart", "cart", "items", id));
      return;
    }
    updateDoc(doc(db, "users", user.uid, "cart", "cart", "items", id), {
      quantity: newQty
    });
  };

  const removeItem = async (id: string) => {
    if (!user || !db) return;
    deleteDoc(doc(db, "users", user.uid, "cart", "cart", "items", id));
    toast({ title: "Item removed from cart" });
  };

  const handleCheckout = () => {
    const isProfileIncomplete = !profile?.firstName || !profile?.lastName || !profile?.location;
    
    if (isProfileIncomplete) {
      toast({
        title: "Profile Incomplete",
        description: "Please fill in your delivery details in your profile before checking out.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Checkout Information",
      description: "Note: We currently don't have a payment gateway integrated. This is a prototype.",
      action: <Info className="h-4 w-4" />
    });
  };

  const SHIPPING_FEE = 5.00;
  const subtotal = items?.reduce((acc, item) => {
    const itemPrice = item.priceAtAddToCart || 12.00;
    return acc + (itemPrice * item.quantity);
  }, 0) || 0;

  const total = subtotal > 0 ? subtotal + SHIPPING_FEE : 0;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="bg-black/60 backdrop-blur-2xl border-white/10 text-white w-full sm:max-w-md flex flex-col p-0 transition-all duration-500 ease-in-out">
        <SheetHeader className="p-6 border-b border-white/5">
          <SheetTitle className="text-2xl font-headline font-bold tracking-widest uppercase flex items-center gap-3">
            Your Cart
            {items && items.length > 0 && (
              <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded-full font-mono">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-white/20 uppercase tracking-[0.3em] text-[10px] animate-pulse">Synchronizing Cart...</p>
            </div>
          ) : items && items.length > 0 ? (
            items.map((item) => {
              const product = flavors.find(f => f.id === item.productId);
              if (!product) return null;
              return (
                <div key={item.id} className="flex gap-6 items-center group animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="relative w-20 h-24 bg-neutral-900/40 rounded-lg overflow-hidden border border-white/5 group-hover:border-white/20 transition-all">
                    <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-2" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold uppercase tracking-widest truncate">{product.name}</h4>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                      ${(item.priceAtAddToCart || 12.00).toFixed(2)} / unit
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-white/10 rounded-full px-2 py-1 bg-white/5">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="p-1 text-white/40 hover:text-white transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-[10px] font-bold font-mono">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="p-1 text-white/40 hover:text-white transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-white/10 hover:text-destructive transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold font-mono">
                      ${((item.priceAtAddToCart || 12.00) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6">
                 <Truck className="text-white/20" size={20} />
              </div>
              <p className="text-white/20 uppercase tracking-[0.3em] text-[10px] mb-4">Your delivery is empty</p>
              <button onClick={onClose} className="text-[10px] font-bold uppercase tracking-widest border-b border-white/20 hover:border-white transition-all pb-1">Start Shopping</button>
            </div>
          )}
        </div>

        {items && items.length > 0 && (
          <div className="p-8 border-t border-white/5 bg-black/40 backdrop-blur-3xl">
            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-white/40">Subtotal</span>
                <span className="text-xs font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-white/40">Shipping</span>
                <span className="text-xs font-mono">${SHIPPING_FEE.toFixed(2)}</span>
              </div>
              <div className="h-px w-full bg-white/5 my-2" />
              <div className="flex justify-between items-end">
                <span className="text-[11px] font-bold uppercase tracking-widest">Total</span>
                <span className="text-3xl font-headline font-bold">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full h-14 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-full hover:bg-neutral-200 transition-all active:scale-95 shadow-2xl"
            >
              Proceed to Checkout
            </button>
            <div className="mt-6 flex items-center justify-center gap-2 opacity-30">
              <Truck size={12} />
              <p className="text-[8px] uppercase tracking-[0.4em] font-bold">Standard Delivery: 2-3 Days</p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
