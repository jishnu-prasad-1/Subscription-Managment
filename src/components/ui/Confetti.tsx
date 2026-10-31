"use client";

import React, { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  shape: "circle" | "square" | "triangle";
  speedY: number;
  speedX: number;
}

export const ConfettiCannon: React.FC<{ active: boolean; onComplete?: () => void }> = ({
  active,
  onComplete,
}) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }

    const colors = ["#25F4D2", "#FFD600", "#FF4D6D", "#FF6B00", "#00BFA0", "#00C2E8"];
    const shapes: ("circle" | "square" | "triangle")[] = ["circle", "square", "triangle"];

    const newPieces: ConfettiPiece[] = Array.from({ length: 48 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: -10 - Math.random() * 20,
      size: 8 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      speedY: 2 + Math.random() * 4,
      speedX: (Math.random() - 0.5) * 3,
    }));

    setPieces(newPieces);

    const timer = setTimeout(() => {
      setPieces([]);
      onComplete?.();
    }, 2800);

    return () => clearTimeout(timer);
  }, [active, onComplete]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.shape === "triangle" ? "transparent" : p.color,
            borderRadius: p.shape === "circle" ? "50%" : "0px",
            border: p.shape !== "triangle" ? "1.5px solid #1D1E24" : undefined,
            borderLeft: p.shape === "triangle" ? `${p.size / 2}px solid transparent` : undefined,
            borderRight: p.shape === "triangle" ? `${p.size / 2}px solid transparent` : undefined,
            borderBottom: p.shape === "triangle" ? `${p.size}px solid ${p.color}` : undefined,
            transform: `rotate(${p.rotation}deg)`,
            animation: `fall 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards`,
            boxShadow: p.shape !== "triangle" ? "2px 2px 0px #1D1E24" : undefined,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

