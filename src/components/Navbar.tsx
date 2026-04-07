
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
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-8'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-headline font-bold tracking-tighter">
          OLIPOP<span className="text-primary">.</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <button className="md:hidden text-white">
          <div className="w-6 h-0.5 bg-white mb-1.5" />
          <div className="w-4 h-0.5 bg-white" />
        </button>
      </div>
    </nav>
  );
}
