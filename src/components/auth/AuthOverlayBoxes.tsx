"use client";

import React from "react";

/**
 * Renders the 4 guide boxes using specific images from Cloudinary.
 * Each box is 45px x 45px (1x1 ratio) as requested.
 * Positions are precision-tuned to UI targets.
 */
export function AuthOverlayBoxes() {
  const boxStyle = "absolute flex items-center justify-center border-2 border-[#3d1a5e]/40 bg-white/20 backdrop-blur-md rounded-xl overflow-hidden pointer-events-none z-50 shadow-lg transition-all";
  const size = "45px";

  const images = {
    box1: "https://res.cloudinary.com/dhzt5kvoz/image/upload/v1777043999/WhatsApp_Image_2026-04-24_at_9.17.53_PM_lvzjdp.jpg",
    box2: "https://res.cloudinary.com/dhzt5kvoz/image/upload/v1777044009/WhatsApp_Image_2026-04-24_at_9.17.53_PM_1_otdn45.jpg",
    box3: "https://res.cloudinary.com/dhzt5kvoz/image/upload/v1777044009/WhatsApp_Image_2026-04-24_at_9.17.52_PM_j9rwye.jpg",
    box4: "https://res.cloudinary.com/dhzt5kvoz/image/upload/v1777044008/WhatsApp_Image_2026-04-24_at_9.17.52_PM_1_l1rzj0.jpg"
  };

  return (
    <>
      {/* BOX 1: Close to the NECTAR logo title */}
      <div 
        className={boxStyle} 
        style={{ width: size, height: size, top: '15px', left: '15px' }}
      >
        <img src={images.box1} alt="Guide 1" className="w-full h-full object-cover" />
      </div>

      {/* BOX 2: Close to the heading title */}
      <div 
        className={boxStyle} 
        style={{ width: size, height: size, top: '80px', right: '15px' }}
      >
        <img src={images.box2} alt="Guide 2" className="w-full h-full object-cover" />
      </div>

      {/* BOX 3: Positioned down near the primary CTA button */}
      <div 
        className={boxStyle} 
        style={{ width: size, height: size, top: '285px', left: '8px' }}
      >
        <img src={images.box3} alt="Guide 3" className="w-full h-full object-cover" />
      </div>

      {/* BOX 4: Close to the "Sign Up" / "Login" switch text at the bottom */}
      <div 
        className={boxStyle} 
        style={{ width: size, height: size, bottom: '12px', right: '15px' }}
      >
        <img src={images.box4} alt="Guide 4" className="w-full h-full object-cover" />
      </div>
    </>
  );
}
