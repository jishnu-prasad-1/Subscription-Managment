import React from "react";

export type PennyMood = "dispatch" | "celebrate" | "alert" | "thinking";

interface PennyMascotProps {
  mood?: PennyMood;
  size?: "sm" | "md" | "lg" | "xl" | number;
  className?: string;
  animate?: boolean;
  animated?: boolean;
}

export const PennyMascot: React.FC<PennyMascotProps> = ({
  mood = "dispatch",
  size = "md",
  className = "",
  animate = true,
  animated,
}) => {
  const shouldAnimate = animated !== undefined ? animated : animate;

  const sizeMap = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-28 h-28",
    xl: "w-36 h-36",
  };

  const isPresetSize = typeof size === "string" && size in sizeMap;
  const sizeClass = isPresetSize ? sizeMap[size as keyof typeof sizeMap] : "";
  const inlineStyle = typeof size === "number" ? { width: size, height: size } : undefined;

  return (
    <div
      style={inlineStyle}
      className={`relative inline-flex items-center justify-center shrink-0 ${sizeClass} ${className} ${
        shouldAnimate ? "group hover:scale-105 transition-transform duration-200" : ""
      }`}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[2.5px_2.5px_0px_#1D1E24]"
      >
        <defs>
          {/* Warm Metallic Coin Gradient */}
          <radialGradient id="coinGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFA64D" />
            <stop offset="60%" stopColor="#FF6B00" />
            <stop offset="100%" stopColor="#D94E00" />
          </radialGradient>
          {/* Shiny Specular Highlight Gradient */}
          <linearGradient id="specularGlint" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFB366" stopOpacity="0" />
          </linearGradient>
          {/* Glove Gradient */}
          <linearGradient id="gloveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E6E8F0" />
          </linearGradient>
          {/* Shoe Gradient */}
          <linearGradient id="shoeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF4D6D" />
            <stop offset="100%" stopColor="#C9184A" />
          </linearGradient>
        </defs>

        {/* ================= CARTOON SHOES & LEGS (BOTTOM) ================= */}
        {/* Left Leg & Shoe */}
        <line x1="48" y1="88" x2="44" y2="102" stroke="#1D1E24" strokeWidth="4" strokeLinecap="round" />
        <g id="left-shoe">
          {/* Sole Shadow */}
          <rect x="30" y="106" width="22" height="4" rx="2" fill="#1D1E24" />
          {/* Red Boot Body */}
          <ellipse cx="41" cy="103" rx="11" ry="6" fill="url(#shoeGrad)" stroke="#1D1E24" strokeWidth="2.5" />
          {/* Toe Cap Highlight */}
          <ellipse cx="36" cy="101" rx="4" ry="2" fill="#FF8FA3" />
        </g>

        {/* Right Leg & Shoe */}
        <line x1="72" y1="88" x2="76" y2="102" stroke="#1D1E24" strokeWidth="4" strokeLinecap="round" />
        <g id="right-shoe">
          {/* Sole Shadow */}
          <rect x="68" y="106" width="22" height="4" rx="2" fill="#1D1E24" />
          {/* Red Boot Body */}
          <ellipse cx="79" cy="103" rx="11" ry="6" fill="url(#shoeGrad)" stroke="#1D1E24" strokeWidth="2.5" />
          {/* Toe Cap Highlight */}
          <ellipse cx="84" cy="101" rx="4" ry="2" fill="#FF8FA3" />
        </g>

        {/* ================= ARMS & GLOVES (BEHIND OR BESIDE COIN) ================= */}
        {mood === "celebrate" ? (
          /* Celebrate: Both Hands High in the Air (\o/) with Sparkles */
          <g id="celebrate-arms">
            {/* Left Arm Raised */}
            <path d="M30 60 Q16 42 22 28" stroke="#1D1E24" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <g transform="translate(18, 22) rotate(-20)">
              <rect x="0" y="4" width="10" height="4" rx="2" fill="#1D1E24" />
              <path d="M-2 6 C-4 2 2 -4 8 -2 C14 -4 18 2 16 8 C14 14 6 16 0 10 Z" fill="url(#gloveGrad)" stroke="#1D1E24" strokeWidth="2" />
              {/* Glove Cuffs & Creases */}
              <line x1="3" y1="2" x2="5" y2="7" stroke="#1D1E24" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Right Arm Raised */}
            <path d="M90 60 Q104 42 98 28" stroke="#1D1E24" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <g transform="translate(100, 22) rotate(20)">
              <rect x="-8" y="4" width="10" height="4" rx="2" fill="#1D1E24" />
              <path d="M2 6 C4 2 -2 -4 -8 -2 C-14 -4 -18 2 -16 8 C-14 14 -6 16 0 10 Z" fill="url(#gloveGrad)" stroke="#1D1E24" strokeWidth="2" />
              {/* Glove Cuffs & Creases */}
              <line x1="-3" y1="2" x2="-5" y2="7" stroke="#1D1E24" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Sparkle Stars ✦ */}
            <path d="M12 16 L14 11 L16 16 L21 18 L16 20 L14 25 L12 20 L7 18 Z" fill="#FFD600" stroke="#1D1E24" strokeWidth="1" />
            <path d="M104 16 L106 11 L108 16 L113 18 L108 20 L106 25 L104 20 L99 18 Z" fill="#25F4D2" stroke="#1D1E24" strokeWidth="1" />
          </g>
        ) : mood === "alert" ? (
          /* Alert: Left Hand on Hip, Right Hand Pointing Watchfully */
          <g id="alert-arms">
            {/* Left Arm on Hip */}
            <path d="M28 58 Q15 65 24 75" stroke="#1D1E24" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="25" cy="74" r="5" fill="url(#gloveGrad)" stroke="#1D1E24" strokeWidth="2" />

            {/* Right Arm Pointing Outward */}
            <path d="M92 58 Q105 52 112 50" stroke="#1D1E24" strokeWidth="4" strokeLinecap="round" fill="none" />
            <g transform="translate(112, 50)">
              <ellipse cx="2" cy="0" rx="6" ry="4" fill="url(#gloveGrad)" stroke="#1D1E24" strokeWidth="2" />
              {/* Pointing index finger */}
              <path d="M4 -2 L12 -2 C13 -2 13 1 12 1 L4 1" fill="url(#gloveGrad)" stroke="#1D1E24" strokeWidth="1.5" />
            </g>
          </g>
        ) : mood === "thinking" ? (
          /* Thinking: Left Arm on Hip, Right Arm Curled to Chin */
          <g id="thinking-arms">
            {/* Left Arm on Hip */}
            <path d="M28 58 Q16 65 24 75" stroke="#1D1E24" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="25" cy="74" r="5.5" fill="url(#gloveGrad)" stroke="#1D1E24" strokeWidth="2" />

            {/* Right Arm Bent Up to Chin */}
            <path d="M90 62 Q100 75 88 78 Q78 80 72 70" stroke="#1D1E24" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="72" cy="69" r="6" fill="url(#gloveGrad)" stroke="#1D1E24" strokeWidth="2" />
            <line x1="71" y1="67" x2="75" y2="71" stroke="#1D1E24" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        ) : (
          /* Dispatch: Classic Waving Right Hand, Left Hand on Hip */
          <g id="dispatch-arms">
            {/* Left Arm Resting on Hip */}
            <path d="M28 58 Q15 66 23 74" stroke="#1D1E24" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="24" cy="74" r="5.5" fill="url(#gloveGrad)" stroke="#1D1E24" strokeWidth="2" />
            <line x1="22" y1="72" x2="26" y2="76" stroke="#1D1E24" strokeWidth="1.5" strokeLinecap="round" />

            {/* Right Arm Waving Cheerful Greeting */}
            <path d="M92 56 Q106 46 102 32" stroke="#1D1E24" strokeWidth="4" strokeLinecap="round" fill="none" />
            <g transform="translate(102, 30) rotate(15)">
              {/* Glove Cuff */}
              <rect x="-2" y="4" width="8" height="3" rx="1.5" fill="#1D1E24" />
              {/* Palm */}
              <circle cx="3" cy="1" r="5.5" fill="url(#gloveGrad)" stroke="#1D1E24" strokeWidth="2" />
              {/* 4 Fingers Waving */}
              <path d="M-2 -3 C-3 -6 0 -7 1 -4" stroke="#1D1E24" strokeWidth="1.8" fill="url(#gloveGrad)" />
              <path d="M2 -4 C1 -8 5 -8 5 -4" stroke="#1D1E24" strokeWidth="1.8" fill="url(#gloveGrad)" />
              <path d="M6 -4 C6 -8 9 -7 8 -3" stroke="#1D1E24" strokeWidth="1.8" fill="url(#gloveGrad)" />
              <path d="M8 -2 C10 -4 12 -2 10 1" stroke="#1D1E24" strokeWidth="1.8" fill="url(#gloveGrad)" />
            </g>
          </g>
        )}

        {/* ================= COIN BODY & METALLIC RIM ================= */}
        {/* Outer Coin Drop Shadow Ring */}
        <circle cx="60" cy="54" r="38" fill="#1D1E24" />
        {/* Outer Coin Rim */}
        <circle cx="60" cy="53" r="37" fill="#FF9433" stroke="#1D1E24" strokeWidth="2.5" />
        {/* Beveled Metallic Middle Rim */}
        <circle cx="60" cy="53" r="34" fill="url(#coinGrad)" stroke="#1D1E24" strokeWidth="2" />

        {/* Coin Edge Milling / Serrated Coin Notches */}
        <circle
          cx="60"
          cy="53"
          r="32"
          stroke="#FFD600"
          strokeWidth="1.8"
          strokeDasharray="3 2"
          fill="none"
          opacity="0.9"
        />

        {/* Inner Coin Recessed Face */}
        <circle cx="60" cy="53" r="29" fill="#FF7518" stroke="#1D1E24" strokeWidth="1.5" />

        {/* Embossed Antique Currency Mark '¢' / 'B' behind face */}
        <path
          d="M60 30 V76 M52 38 C68 38 70 48 60 52 C72 56 70 70 52 70 H48"
          stroke="#FFA34D"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
        />

        {/* Glossy Specular Arc Reflection (Top-Left) */}
        <path
          d="M40 33 A 26 26 0 0 1 76 29"
          stroke="url(#specularGlint)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Sparkle Glint ✦ (Top-Right Coin Rim) */}
        <path
          d="M86 31 L88 27 L90 31 L94 33 L90 35 L88 39 L86 35 L82 33 Z"
          fill="#FFF9F0"
          stroke="#1D1E24"
          strokeWidth="1"
        />

        {/* ================= FACIAL FEATURES ================= */}
        {mood === "alert" ? (
          /* Alert: Wide Watchful Cartoon Eyes & O-Mouth */
          <g id="alert-face">
            {/* Alert Left Eye */}
            <circle cx="49" cy="46" r="8" fill="#FFFFFF" stroke="#1D1E24" strokeWidth="2.5" />
            <circle cx="50" cy="46" r="4" fill="#1D1E24" />
            <circle cx="48" cy="44" r="1.8" fill="#FFFFFF" />

            {/* Alert Right Eye */}
            <circle cx="71" cy="46" r="8" fill="#FFFFFF" stroke="#1D1E24" strokeWidth="2.5" />
            <circle cx="70" cy="46" r="4" fill="#1D1E24" />
            <circle cx="68" cy="44" r="1.8" fill="#FFFFFF" />

            {/* Worried / Raised Curved Eyebrows */}
            <path d="M43 35 Q49 30 55 35" stroke="#1D1E24" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M65 35 Q71 30 77 35" stroke="#1D1E24" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Shocked / Open O-Mouth */}
            <ellipse cx="60" cy="65" rx="5.5" ry="7" fill="#1D1E24" />
            <ellipse cx="60" cy="67" rx="3.5" ry="4" fill="#FF4D6D" />
          </g>
        ) : mood === "celebrate" ? (
          /* Celebrate: Happy Arc Eyes, Starry Twinkle & Wide Joyous Smile */
          <g id="celebrate-face">
            {/* Left Eye Happy Arc */}
            <path d="M43 47 Q50 37 57 47" stroke="#1D1E24" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M44 48 Q50 40 56 48" stroke="#1D1E24" strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Right Eye Happy Arc */}
            <path d="M63 47 Q70 37 77 47" stroke="#1D1E24" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M64 48 Q70 40 76 48" stroke="#1D1E24" strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Joyous Eyebrows */}
            <path d="M44 38 Q50 33 56 38" stroke="#1D1E24" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M64 38 Q70 33 76 38" stroke="#1D1E24" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Huge Joyous Open Smile with Teeth & Tongue */}
            <g id="celebrate-mouth">
              <path
                d="M45 57 C45 57 52 75 60 75 C68 75 75 57 75 57 Z"
                fill="#1D1E24"
                stroke="#1D1E24"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* White Upper Tooth Bar */}
              <path d="M47 58 C51 61 69 61 73 58" fill="#FFFFFF" stroke="#1D1E24" strokeWidth="1.5" />
              {/* Pink Tongue */}
              <path d="M53 69 C55 64 65 64 67 69 C65 74 55 74 53 69 Z" fill="#FF4D6D" />
            </g>
          </g>
        ) : mood === "thinking" ? (
          /* Thinking: Inquisitive Eyes & Quirky Smirk */
          <g id="thinking-face">
            {/* Left Eye (Wide) */}
            <ellipse cx="49" cy="46" rx="6.5" ry="8" fill="#FFFFFF" stroke="#1D1E24" strokeWidth="2.5" />
            <circle cx="51" cy="44" r="3.2" fill="#1D1E24" />
            <circle cx="50" cy="42" r="1.5" fill="#FFFFFF" />

            {/* Right Eye (Squinting / Puzzled) */}
            <ellipse cx="71" cy="47" rx="6" ry="6.5" fill="#FFFFFF" stroke="#1D1E24" strokeWidth="2.5" />
            <circle cx="72" cy="45" r="3" fill="#1D1E24" />
            <circle cx="71" cy="43" r="1.5" fill="#FFFFFF" />

            {/* Tilted Eyebrows */}
            <path d="M43 37 L54 39" stroke="#1D1E24" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M66 39 L77 34" stroke="#1D1E24" strokeWidth="2.5" strokeLinecap="round" />

            {/* Puzzled / Pursed Smirk */}
            <path d="M50 63 Q60 67 68 60" stroke="#1D1E24" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          /* Dispatch: Classic Friendly Disney/Mid-Century Big Eyes & Warm Smile */
          <g id="dispatch-face">
            {/* Left Cartoon Eye */}
            <ellipse cx="49" cy="45" rx="6.5" ry="8.5" fill="#FFFFFF" stroke="#1D1E24" strokeWidth="2.5" />
            <ellipse cx="51" cy="45" rx="3.5" ry="4.5" fill="#1D1E24" />
            {/* Primary Catchlight */}
            <circle cx="49.5" cy="42.5" r="1.8" fill="#FFFFFF" />
            {/* Secondary Catchlight */}
            <circle cx="52" cy="47" r="1" fill="#FFFFFF" />

            {/* Right Cartoon Eye */}
            <ellipse cx="71" cy="45" rx="6.5" ry="8.5" fill="#FFFFFF" stroke="#1D1E24" strokeWidth="2.5" />
            <ellipse cx="72.5" cy="45" rx="3.5" ry="4.5" fill="#1D1E24" />
            {/* Primary Catchlight */}
            <circle cx="71" cy="42.5" r="1.8" fill="#FFFFFF" />
            {/* Secondary Catchlight */}
            <circle cx="73.5" cy="47" r="1" fill="#FFFFFF" />

            {/* Friendly Eyebrows */}
            <path d="M44 35 Q49 32 54 35" stroke="#1D1E24" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M66 35 Q71 32 76 35" stroke="#1D1E24" strokeWidth="2.2" strokeLinecap="round" fill="none" />

            {/* Warm Friendly Smile with Dimple Marks */}
            <g id="dispatch-smile">
              <path d="M46 58 Q60 72 74 58" stroke="#1D1E24" strokeWidth="3.2" strokeLinecap="round" fill="none" />
              {/* Smile dimples */}
              <path d="M44 57 Q46 60 48 59" stroke="#1D1E24" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              <path d="M72 59 Q74 60 76 57" stroke="#1D1E24" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            </g>
          </g>
        )}

        {/* Rosy Blushing Cheeks */}
        <ellipse cx="38" cy="55" rx="5" ry="3" fill="#FF4D6D" opacity="0.6" />
        <ellipse cx="82" cy="55" rx="5" ry="3" fill="#FF4D6D" opacity="0.6" />
        {/* Cute Cheek Stipple / Highlight */}
        <line x1="36" y1="54" x2="39" y2="57" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
        <line x1="80" y1="54" x2="83" y2="57" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      </svg>
    </div>
  );
};
