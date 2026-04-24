"use client";

import React from "react";

export function AuthLogo() {
  const primaryColor = "#740A03";
  const secondaryColor = "#C3110C";
  const taglineColor = "#FFC193";

  return (
    <div className="text-center mb-4 relative">
      <div 
        className="font-headline font-black text-[30px] leading-none tracking-[3px] bg-clip-text text-transparent"
        style={{ backgroundImage: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}
      >
        NECTAR
      </div>
      <p 
        className="text-[11px] tracking-[1.8px] mt-1 font-medium opacity-60"
        style={{ color: taglineColor }}
      >
        Fresh Fruit Juice
      </p>
    </div>
  );
}