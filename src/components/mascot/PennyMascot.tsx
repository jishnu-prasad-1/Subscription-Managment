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
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  const isPresetSize = typeof size === "string" && size in sizeMap;
  const sizeClass = isPresetSize ? sizeMap[size as keyof typeof sizeMap] : "";
  const inlineStyle = typeof size === "number" ? { width: size, height: size } : undefined;

  return (
    <div
      style={inlineStyle}
      className={`relative inline-flex items-center justify-center shrink-0 ${sizeClass} ${className} ${
        shouldAnimate ? "hover:scale-105 transition-transform" : ""
      }`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[2px_2px_0px_#1D1E24]"
      >
        {/* Outer Coin Edge & Ridged Rim */}
        <circle cx="50" cy="50" r="46" fill="#FF8533" stroke="#1D1E24" strokeWidth="3" />
        <circle cx="50" cy="50" r="41" fill="#FF6B00" stroke="#1D1E24" strokeWidth="2" />

        {/* Decorative Coin Milling / Ridge Ticks */}
        <circle
          cx="50"
          cy="50"
          r="36"
          stroke="#FFD600"
          strokeWidth="1.5"
          strokeDasharray="4 2"
          fill="none"
        />

        {/* Inner Coin Canvas */}
        <circle cx="50" cy="50" r="32" fill="#FF7518" />

        {/* Embossed Currency Mark Behind Face (Stylized '¢' or 'B' for Brightloop) */}
        <path
          d="M50 24 V76 M42 32 C58 32 60 44 48 48 C62 52 60 68 42 68 H38"
          stroke="#FF9F43"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.35"
        />

        {/* Eyes based on mood */}
        {mood === "alert" ? (
          <g>
            {/* Wide Alert Eyes */}
            <circle cx="39" cy="42" r="7.5" fill="#FFFFFF" stroke="#1D1E24" strokeWidth="2.5" />
            <circle cx="39" cy="42" r="3.5" fill="#1D1E24" />
            <circle cx="37" cy="40" r="1.5" fill="#FFFFFF" />

            <circle cx="61" cy="42" r="7.5" fill="#FFFFFF" stroke="#1D1E24" strokeWidth="2.5" />
            <circle cx="61" cy="42" r="3.5" fill="#1D1E24" />
            <circle cx="59" cy="40" r="1.5" fill="#FFFFFF" />

            {/* Alert Raised Eyebrows */}
            <path d="M33 32 Q39 28 45 32" stroke="#1D1E24" strokeWidth="2" strokeLinecap="round" />
            <path d="M55 32 Q61 28 67 32" stroke="#1D1E24" strokeWidth="2" strokeLinecap="round" />
          </g>
        ) : mood === "celebrate" ? (
          <g>
            {/* Sparkly / Happy Arched Eyes */}
            <path
              d="M32 44 Q39 34 46 44"
              stroke="#1D1E24"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M54 44 Q61 34 68 44"
              stroke="#1D1E24"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : mood === "thinking" ? (
          <g>
            {/* Contemplative Eyes */}
            <ellipse cx="39" cy="43" rx="5" ry="7" fill="#FFFFFF" stroke="#1D1E24" strokeWidth="2" />
            <circle cx="41" cy="41" r="2.5" fill="#1D1E24" />
            <ellipse cx="61" cy="43" rx="5" ry="7" fill="#FFFFFF" stroke="#1D1E24" strokeWidth="2" />
            <circle cx="63" cy="41" r="2.5" fill="#1D1E24" />
            {/* Tilted Eyebrow */}
            <path d="M34 33 L45 35" stroke="#1D1E24" strokeWidth="2" strokeLinecap="round" />
            <path d="M55 35 L66 31" stroke="#1D1E24" strokeWidth="2" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            {/* Standard Friendly Dispatch Eyes */}
            <ellipse cx="39" cy="43" rx="5.5" ry="7.5" fill="#FFFFFF" stroke="#1D1E24" strokeWidth="2" />
            <circle cx="40.5" cy="43.5" r="2.8" fill="#1D1E24" />
            <circle cx="39" cy="41.5" r="1.2" fill="#FFFFFF" />

            <ellipse cx="61" cy="43" rx="5.5" ry="7.5" fill="#FFFFFF" stroke="#1D1E24" strokeWidth="2" />
            <circle cx="62.5" cy="43.5" r="2.8" fill="#1D1E24" />
            <circle cx="61" cy="41.5" r="1.2" fill="#FFFFFF" />

            <path d="M35 34 Q40 31 44 34" stroke="#1D1E24" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M56 34 Q60 31 65 34" stroke="#1D1E24" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {/* Rosy Cheeks */}
        <ellipse cx="31" cy="53" rx="4.5" ry="2.5" fill="#FF4D6D" opacity="0.65" />
        <ellipse cx="69" cy="53" rx="4.5" ry="2.5" fill="#FF4D6D" opacity="0.65" />

        {/* Mouth */}
        {mood === "celebrate" ? (
          <path
            d="M36 56 Q50 74 64 56 Z"
            fill="#FFFFFF"
            stroke="#1D1E24"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        ) : mood === "alert" ? (
          <ellipse cx="50" cy="62" rx="4.5" ry="6" fill="#1D1E24" />
        ) : (
          <path
            d="M37 57 Q50 69 63 57"
            stroke="#1D1E24"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </svg>
    </div>
  );
};

