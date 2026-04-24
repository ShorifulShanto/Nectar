"use client";

import React from "react";

export function AuthLogo() {
  // CONFIG: LOGO COLORS AND SIZING
  const primaryColor = "#7030b0";
  const secondaryColor = "#a03070";
  const taglineColor = "#7a5a9a";

  return (
    <div className="text-center mb-4 relative">
      <div 
        className="font-headline font-black text-[30px] leading-none tracking-[3px] bg-clip-text text-transparent"
        style={{ backgroundImage: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}
      >
        NECTAR
      </div>
      <p 
        className="text-[11px] tracking-[1.8px] mt-1 font-medium"
        style={{ color: taglineColor }}
      >
        Fresh Fruit Juice
      </p>
    </div>
  );
}
