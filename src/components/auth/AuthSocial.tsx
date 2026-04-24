"use client";

import React from "react";

interface AuthSocialProps {
  onGoogle: () => void;
  isLoading: boolean;
}

export function AuthSocial({ onGoogle, isLoading }: AuthSocialProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button 
        onClick={onGoogle}
        disabled={isLoading}
        className="flex items-center justify-center gap-3 h-12 rounded-xl border border-[#FEFFD3]/10 bg-black/40 hover:bg-black/60 transition-all active:scale-95 disabled:opacity-50 group"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-5 h-5"/>
        <span className="text-[11px] font-bold text-[#FEFFD3] uppercase tracking-widest">Google</span>
      </button>
      <button 
        disabled={isLoading}
        className="flex items-center justify-center gap-3 h-12 rounded-xl border border-[#FEFFD3]/10 bg-black/40 hover:bg-black/60 transition-all active:scale-95 disabled:opacity-50 group"
      >
        <svg className="w-5 h-5 text-[#FEFFD3]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.96.95-2.06 1.18-3.12 1.18-1.12 0-2.07-.3-3.2-.3-1.15 0-2.22.33-3.23.33-1.04 0-2.2-.23-3.18-1.22C2.18 18.15 1.1 14.2 1.1 11.23c0-3.1 1.6-4.7 3.3-4.7.9 0 1.94.48 2.6.48 1.14 0 1.94-.48 2.94-.48 1.44 0 2.6.5 3.34 1.54-3.1.84-2.6 5.5.3 6.64-.6 1.4-1.4 2.8-2.53 4.07zM12.03 5.4c.1-.8 1-2.4 2.4-3.3.15 1.5-.9 3.1-2.4 3.6-.1-.1-.1-.2-.2-.3z"/>
        </svg>
        <span className="text-[11px] font-bold text-[#FEFFD3] uppercase tracking-widest">Apple</span>
      </button>
    </div>
  );
}
