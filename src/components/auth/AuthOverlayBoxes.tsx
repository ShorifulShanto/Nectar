"use client";

import React from "react";

/**
 * Renders the 4 numbered boxes from the wireframe layout.
 * Each box can be easily edited for size, color, and position.
 */
export function AuthOverlayBoxes() {
  const boxStyle = "absolute flex items-center justify-center border-2 border-[#3d1a5e]/30 bg-white/10 backdrop-blur-sm rounded-lg font-bold text-[#3d1a5e] text-lg pointer-events-none z-50";

  return (
    <>
      {/* BOX 1: Top-Left of Logo area */}
      <div 
        className={boxStyle} 
        style={{ width: '45px', height: '45px', top: '10px', left: '-20px' }}
      >
        1
      </div>

      {/* BOX 2: Top-Right floating */}
      <div 
        className={boxStyle} 
        style={{ width: '50px', height: '50px', top: '80px', right: '-15px' }}
      >
        2
      </div>

      {/* BOX 3: Mid-Left next to inputs */}
      <div 
        className={boxStyle} 
        style={{ width: '40px', height: '40px', top: '220px', left: '-25px' }}
      >
        3
      </div>

      {/* BOX 4: Bottom-Right next to social buttons */}
      <div 
        className={boxStyle} 
        style={{ width: '45px', height: '45px', bottom: '60px', right: '-20px' }}
      >
        4
      </div>
    </>
  );
}
