
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { flavors } from "@/lib/flavor-data";
import { Trash2, Plus, Minus } from "lucide-react";
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

  const { data: items, isLoading } = useCollection(cartQuery);

  const updateQty = async (id: string, newQty: number) => {
    if (!user || !db) return;
    if (newQty < 1) {
      await deleteDoc(doc(db, "users", user.uid, "cart", "cart", "items", id));
      return;
    }
    await updateDoc(doc(db, "users", user.uid, "cart", "cart", "items", id), {
      quantity: newQty
    });
  };

  const removeItem = async (id: string) => {
    if (!user || !db) return;
    await deleteDoc(doc(db, "users", user.uid, "cart", "cart", "items", id));
  };

  const total = items?.reduce((acc, item) => {
    const product = flavors.find(f => f.id === item.productId);
    return acc + (product ? 12 * item.quantity : 0);
  }, 0) || 0;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="bg-black border-white/10 text-white w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-white/5">
          <SheetTitle className="text-2xl font-headline tracking-widest uppercase">Your Cart</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {isLoading ? (
            <p className="text-center text-white/20 uppercase tracking-widest text-[10px]">Loading cart...</p>
          ) : items && items.length > 0 ? (
            items.map((item) => {
              const product = flavors.find(f => f.id === item.productId);
              if (!product) return null;
              return (
                <div key={item.id} className="flex gap-6 items-center group">
                  <div className="relative w-20 h-24 bg-neutral-900 rounded-lg overflow-hidden border border-white/5">
                    <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-2" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold uppercase tracking-widest truncate">{product.name}</h4>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">$12.00 / bottle</p>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-white/10 rounded-full px-2 py-1">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="p-1 hover:text-white transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-[10px] font-bold">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="p-1 hover:text-white transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-white/20 hover:text-white transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <p className="text-white/20 uppercase tracking-widest text-[10px] mb-4">Your cart is empty</p>
              <button onClick={onClose} className="text-[10px] font-bold uppercase tracking-widest border-b border-white/20 hover:border-white transition-all">Start Shopping</button>
            </div>
          )}
        </div>

        {items && items.length > 0 && (
          <div className="p-6 border-t border-white/5 bg-neutral-950/50">
            <div className="flex justify-between items-end mb-6">
              <span className="text-[10px] uppercase tracking-widest text-white/40">Subtotal</span>
              <span className="text-2xl font-headline">${total.toFixed(2)}</span>
            </div>
            <button className="w-full h-14 bg-white text-black font-bold uppercase tracking-widest text-[11px] rounded-full hover:bg-neutral-200 transition-colors">
              Checkout
            </button>
            <p className="text-[8px] text-white/20 uppercase tracking-widest text-center mt-4">Shipping calculated at next step</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
