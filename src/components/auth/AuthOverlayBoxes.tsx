"use client";

import React from "react";

/**
 * Renders the 4 numbered boxes from the wireframe layout.
 * Each box is now larger (45px x 45px) with a 1x1 ratio as requested.
 * Positions are maintained close to their respective UI targets.
 */
export function AuthOverlayBoxes() {
  const boxStyle = "absolute flex items-center justify-center border-2 border-[#3d1a5e]/40 bg-white/20 backdrop-blur-md rounded-xl font-bold text-[#3d1a5e] text-xl pointer-events-none z-50 shadow-lg transition-all";
  const size = "45px";

  return (
    <>
      {/* BOX 1: Close to the NECTAR logo title */}
      <div 
        className={boxStyle} 
        style={{ width: size, height: size, top: '15px', left: '15px' }}
      >
        1
      </div>

      {/* BOX 2: Close to the heading title */}
      <div 
        className={boxStyle} 
        style={{ width: size, height: size, top: '80px', right: '15px' }}
      >
        2
      </div>

      {/* BOX 3: Positioned between the Password input and the primary CTA button */}
      <div 
        className={boxStyle} 
        style={{ width: size, height: size, top: '235px', left: '8px' }}
      >
        3
      </div>

      {/* BOX 4: Close to the "Sign Up" / "Login" switch text at the bottom */}
      <div 
        className={boxStyle} 
        style={{ width: size, height: size, bottom: '12px', right: '15px' }}
      >
        4
      </div>
    </>
  );
}
