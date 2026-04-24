"use client";

import React from "react";

interface AuthSocialProps {
  onGoogle: () => void;
  isLoading: boolean;
}

export function AuthSocial({ onGoogle, isLoading }: AuthSocialProps) {
  // CONFIG: SOCIAL BUTTON COLORS AND SHAPES
  const buttonBg = "rgba(255, 255, 255, 0.48)";
  const borderColor = "rgba(255, 255, 255, 0.55)";
  const textColor = "#3d1a5e";

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 my-4 text-[#5a2d6e]/45">
        <div className="flex-1 h-[1px] bg-[rgba(110,50,140,0.18)]" />
        <span className="text-[11px] whitespace-nowrap">or continue with</span>
        <div className="flex-1 h-[1px] bg-[rgba(110,50,140,0.18)]" />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button 
          onClick={onGoogle}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 h-[40px] rounded-[12px] text-[13px] font-semibold hover:bg-white/60 transition-colors disabled:opacity-50"
          style={{ backgroundColor: buttonBg, border: `1px solid ${borderColor}`, color: textColor }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-[18px] h-[18px]"/> Google
        </button>
        <button 
          disabled={isLoading}
          className="flex items-center justify-center gap-2 h-[40px] rounded-[12px] text-[13px] font-semibold hover:bg-white/60 transition-colors disabled:opacity-50"
          style={{ backgroundColor: buttonBg, border: `1px solid ${borderColor}`, color: textColor }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg" alt="F" className="w-[18px] h-[18px]"/> Facebook
        </button>
      </div>
    </div>
  );
}
