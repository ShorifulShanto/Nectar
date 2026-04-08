"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection } from "firebase/firestore";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { CartSidebar } from "./CartSidebar";
import { ProfileModal } from "./ProfileModal";
import { useMemoFirebase } from "@/firebase/provider";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl py-4 border-b border-white/5' : 'bg-transparent py-10'}`}>
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="text-2xl font-headline font-bold tracking-[0.2em] text-primary flex items-center gap-2">
            Olipop
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
          </Link>
          
          <div className="flex items-center gap-4 md:gap-8">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-white/60 hover:text-white transition-colors"
            >
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <button 
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
              >
                <User size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase tracking-widest hidden sm:block font-medium">
                  {user.email?.split('@')[0]}
                </span>
              </button>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="px-5 py-2 border border-primary/20 rounded-full text-[9px] uppercase tracking-widest font-bold hover:bg-primary hover:text-white transition-all bg-white/5 backdrop-blur-md"
              >
                Sign In
              </button>
            )}

            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* Compact Side Navigation Overlay */}
      <div className={`fixed inset-0 z-[110] transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-full sm:max-w-[380px] forest-mirror transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl overflow-hidden`}>
          <div className="h-full flex flex-col p-8 md:p-12 relative">
             {/* Decorative Background Element */}
            <div className="absolute top-[-10%] right-[-20%] w-80 h-80 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
            
            <div className="flex justify-between items-center mb-16 relative z-10">
              <span className="text-xs font-headline font-bold tracking-[0.3em] text-white/40 uppercase">Navigation</span>
              <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <X size={18} className="text-white/40" />
              </button>
            </div>

            <div className="flex flex-col gap-6 relative z-10">
              {navLinks.map((link, i) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-headline font-bold text-white/40 hover:text-primary transition-all hover:translate-x-3 flex items-center gap-4 group"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <span className="text-[10px] font-mono text-white/10 group-hover:text-primary/40">{String(i + 1).padStart(2, '0')}</span>
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto relative z-10">
               <div className="h-px w-full bg-white/10 mb-8" />
               <div className="flex flex-col gap-4">
                 <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-bold">Follow Olipop</p>
                 <div className="flex gap-6 text-[10px] uppercase tracking-widest font-bold text-white/40">
                   <a href="#" className="hover:text-primary transition-colors">IG</a>
                   <a href="#" className="hover:text-primary transition-colors">TW</a>
                   <a href="#" className="hover:text-primary transition-colors">FB</a>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}
