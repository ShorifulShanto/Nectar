
"use client";

import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShoppingBag, Package, Truck, CheckCircle, Clock, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "users", user.uid, "orders");
  }, [db, user]);

  const { data: orders, isLoading } = useCollection(ordersQuery);

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
        <div className="mb-16">
          <p className="text-primary text-[9px] uppercase tracking-[0.5em] mb-4 font-bold">Your History</p>
          <h1 className="text-5xl font-headline font-bold uppercase tracking-tighter">My Orders</h1>
        </div>

        {orders && orders.length > 0 ? (
          <div className="space-y-8">
            {orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order) => (
              <div key={order.id} className="bg-neutral-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm group">
                <div className="p-6 md:p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/2">
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">{order.id}</p>
                    <p className="text-sm font-bold">{format(new Date(order.createdAt), "MMMM dd, yyyy 'at' h:mm a")}</p>
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
                      <p className="text-xl font-headline font-bold text-primary">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-bold">Included Items</p>
                      <div className="space-y-4">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-4 group/item">
                            <div className="w-12 h-12 bg-black/40 border border-white/5 rounded-xl overflow-hidden relative">
                              <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                            </div>
                            <div className="flex-1">
                              <p className="text-[11px] font-bold uppercase tracking-widest">{item.name}</p>
                              <p className="text-[10px] text-white/30 font-mono">Qty: {item.quantity} • ${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-bold">Shipping To</p>
                      <div className="bg-black/20 p-6 rounded-2xl border border-white/5 space-y-2">
                        <p className="text-[12px] font-bold uppercase tracking-widest">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                        <p className="text-[11px] text-white/40 font-light leading-relaxed">{order.shippingAddress.location}</p>
                        <p className="text-[11px] text-white/30 font-mono">{order.shippingAddress.phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center opacity-40">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-xl font-headline font-bold uppercase tracking-widest mb-4">No Orders Found</h3>
            <p className="text-[10px] uppercase tracking-widest mb-10">Your harvest journey hasn't started yet.</p>
            <Button asChild variant="outline" className="rounded-full px-12 uppercase tracking-widest text-[10px]">
              <Link href="/">Explore Flavors</Link>
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
