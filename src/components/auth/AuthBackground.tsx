"use client";

import React from "react";

export function AuthBackground() {
  // CONFIG: BACKGROUND COLORS AND FRUIT STYLING
  const bgGradient = "linear-gradient(145deg, #a04838 0%, #ba4f72 45%, #c87040 100%)";
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-70"
      style={{ background: bgGradient }}
    >
      {/* FRUIT ELEMENTS: Edit sizes and delays here */}
      <div className="absolute top-[5%] left-[2%] text-[62px] fruit-emoji animate-float" style={{ animationDelay: '0s' }}>🍍</div>
      <div className="absolute top-[55%] left-[1%] text-[70px] fruit-emoji animate-float" style={{ animationDelay: '1s' }}>🍉</div>
      <div className="absolute top-[78%] left-[5%] text-[58px] fruit-emoji animate-float" style={{ animationDelay: '2s' }}>🍌</div>
      <div className="absolute top-[28%] left-[1%] text-[46px] fruit-emoji animate-float" style={{ animationDelay: '0.5s' }}>🍓</div>
      <div className="absolute top-[2%] right-[4%] text-[65px] fruit-emoji animate-float" style={{ animationDelay: '1.5s' }}>🍒</div>
      <div className="absolute top-[38%] right-[1%] text-[68px] fruit-emoji animate-float" style={{ animationDelay: '2.5s' }}>🍊</div>
      <div className="absolute top-[72%] right-[2%] text-[58px] fruit-emoji animate-float" style={{ animationDelay: '0.8s' }}>🍇</div>
      <div className="absolute top-[15%] right-[7%] text-[48px] fruit-emoji animate-float" style={{ animationDelay: '3s' }}>🍋</div>
    </div>
  );
}
