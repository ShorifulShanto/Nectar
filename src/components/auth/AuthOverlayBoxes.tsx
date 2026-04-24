"use client";

import React from "react";

/**
 * Renders the 4 numbered boxes from the wireframe layout.
 * Each box can be easily edited for size, color, and position.
 * Positions are now adjusted to be closer to specific UI elements.
 */
export function AuthOverlayBoxes() {
  const boxStyle = "absolute flex items-center justify-center border-2 border-[#3d1a5e]/30 bg-white/10 backdrop-blur-sm rounded-lg font-bold text-[#3d1a5e] text-lg pointer-events-none z-50";

  return (
    <>
      {/* BOX 1: Close to the NECTAR logo title */}
      <div 
        className={boxStyle} 
        style={{ width: '35px', height: '35px', top: '20px', left: '15px' }}
      >
        1
      </div>

      {/* BOX 2: Close to the "Welcome Back" / "Create Account" title */}
      <div 
        className={boxStyle} 
        style={{ width: '35px', height: '35px', top: '85px', right: '15px' }}
      >
        2
      </div>

      {/* BOX 3: Positioned between the Password input and the primary CTA button */}
      <div 
        className={boxStyle} 
        style={{ width: '35px', height: '35px', top: '245px', left: '10px' }}
      >
        3
      </div>

      {/* BOX 4: Close to the "Sign Up" / "Login" switch text at the bottom */}
      <div 
        className={boxStyle} 
        style={{ width: '35px', height: '35px', bottom: '15px', right: '15px' }}
      >
        4
      </div>
    </>
  );
}
