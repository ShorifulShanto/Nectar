
"use client";

import React from "react";
import Image from "next/image";

export function AuthBackground() {
  // Using the specific cinematic background image provided
  const bgUrl = "https://res.cloudinary.com/dhzt5kvoz/image/upload/v1777043999/WhatsApp_Image_2026-04-24_at_9.17.53_PM_2_onjkaf.jpg";
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black">
      {/* Primary Cinematic Background Image - Sharp and Full Scale */}
      <div className="relative w-full h-full">
        <Image 
          src={bgUrl}
          alt="Nectar Experience Background"
          fill
          priority
          className="object-cover"
        />
        {/* Subtle vignette to maintain focus on the central form */}
        <div className="absolute inset-0 bg-black/10" />
      </div>
    </div>
  );
}
