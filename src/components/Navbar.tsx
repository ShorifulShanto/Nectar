
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection } from "firebase/firestore";
import { ShoppingCart, User } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { CartSidebar } from "./CartSidebar";
import { useMemoFirebase } from "@/firebase/provider";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useUser();
  const db = useFirestore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "users", user.uid, "cart", "cart", "items");
  }, [db, user]);

  const { data: cartItems } = useCollection(cartQuery);
  const cartCount = cartItems?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;

  const navLinks = [
    { name: "Product", href: "#product" },
    { name: "Ingredients", href: "#ingredients" },
    { name: "Nutrition", href: "#nutrition" },
    { name: "Reviews", href: "#reviews" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-black/70 backdrop-blur-xl py-4 border-b border-white/5' : 'bg-transparent py-10'}`}>
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="text-2xl font-headline font-bold tracking-[0.3em] font-headline text-white">
            OLIPOP
          </Link>
          
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-[10px] uppercase tracking-[0.25em] font-bold text-white/40 hover:text-white transition-all relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-white/60 hover:text-white transition-colors"
            >
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-white text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-widest text-white/40 hidden sm:block">
                  {user.email?.split('@')[0]}
                </span>
                <button className="p-2 text-white/60 hover:text-white transition-colors">
                  <User size={20} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="px-6 py-2 border border-white/20 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
