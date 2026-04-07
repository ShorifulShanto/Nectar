"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Product", href: "#product" },
    { name: "Ingredients", href: "#ingredients" },
    { name: "Nutrition", href: "#nutrition" },
    { name: "Reviews", href: "#reviews" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-black/70 backdrop-blur-xl py-4 border-b border-white/5' : 'bg-transparent py-10'}`}>
      <div className="container mx-auto px-6 md:px-24 flex items-center justify-between">
        <Link href="/" className="text-2xl font-headline font-bold tracking-[0.3em]">
          OLLANHO
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

        <button className="px-6 py-2 border border-white/20 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all">
          Shop
        </button>
      </div>
    </nav>
  );
}