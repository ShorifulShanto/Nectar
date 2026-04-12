"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUser, useFirestore, useCollection, useDoc } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { flavors } from "@/lib/flavor-data";
import { Trash2, Plus, Minus, Truck, Info, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useMemoFirebase } from "@/firebase/provider";
import { useToast } from "@/hooks/use-toast";
import { updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export function CartSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const cartQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "users", user.uid, "cart", "cart", "items");
  }, [db, user]);

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "products");
  }, [db]);

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);

  const { data: items, isLoading } = useCollection(cartQuery);
  const { data: dbProducts } = useCollection(productsQuery);
  const { data: profile } = useDoc(userRef);

  const updateQty = (id: string, newQty: number) => {
    if (!user || !db) return;
    const itemRef = doc(db, "users", user.uid, "cart", "cart", "items", id);
    if (newQty < 1) {
      deleteDocumentNonBlocking(itemRef);
      return;
    }
    updateDocumentNonBlocking(itemRef, { quantity: newQty });
  };

  const removeItem = (id: string) => {
    if (!user || !db) return;
    const itemRef = doc(db, "users", user.uid, "cart", "cart", "items", id);
    deleteDocumentNonBlocking(itemRef);
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
      <SheetContent className="bg-black/60 backdrop-blur-2xl border-white/10 text-white w-full sm:max-w-md flex flex-col p-0 transition-all duration-500 ease-in-out z-[1000]">
        <SheetHeader className="p-6 border-b border-white/5 bg-black/20">
          <SheetTitle className="text-xl font-headline font-bold tracking-widest uppercase flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-primary" />
              Your Cart
            </span>
            {items && items.length > 0 && (
              <span className="text-[10px] bg-primary text-black px-2 py-0.5 rounded-full font-mono font-bold">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-white/20 uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Cart...</p>
            </div>
          ) : items && items.length > 0 ? (
            items.map((item) => {
              const dbProduct = dbProducts?.find(p => p.id === item.productId);
              const flavorConfig = flavors.find(f => f.id === item.productId);
              
              const name = dbProduct?.name || flavorConfig?.name || "Olipop Flavor";
              const image = dbProduct?.image || flavorConfig?.imageUrl || "https://picsum.photos/seed/juice/400/600";
              const price = item.priceAtAddToCart || dbProduct?.price || 12.00;

              return (
                <div key={item.id} className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/5 animate-in fade-in slide-in-from-right-4 duration-500 will-change-transform">
                  <div className="relative w-16 h-16 bg-neutral-900/40 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={image} alt={name} fill className="object-contain p-2" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest truncate">{name}</h4>
                    <p className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5 font-mono">
                      ${price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-white/10 rounded-full px-2 py-0.5 bg-black/40">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="p-1 text-white/40 hover:text-white transition-colors">
                          <Minus size={10} />
                        </button>
                        <span className="w-6 text-center text-[9px] font-bold font-mono">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="p-1 text-white/40 hover:text-white transition-colors">
                          <Plus size={10} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-white/20 hover:text-destructive transition-colors ml-auto group">
                        <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold font-mono text-primary">
                      ${(price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                 <ShoppingBag size={20} />
              </div>
              <p className="text-white uppercase tracking-[0.3em] text-[10px] mb-4">Cart is empty</p>
              <button onClick={onClose} className="text-[10px] font-bold uppercase tracking-widest border-b border-primary hover:text-primary transition-all pb-1">Continue Shopping</button>
            </div>
          )}
        </div>

        {items && items.length > 0 && (
          <div className="p-8 border-t border-white/10 bg-black/40 backdrop-blur-xl">
            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Subtotal</span>
                <span className="text-xs font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Shipping</span>
                <span className="text-xs font-mono">${SHIPPING_FEE.toFixed(2)}</span>
              </div>
              <div className="h-px w-full bg-white/5 my-2" />
              <div className="flex justify-between items-end">
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary">Total Amount</span>
                <span className="text-3xl font-headline font-bold">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full h-14 bg-primary text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-full hover:bg-primary/80 transition-all active:scale-95 shadow-2xl"
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