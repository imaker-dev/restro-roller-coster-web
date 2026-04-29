// components/common/Shimmer.jsx
import React from "react";

export default function Shimmer({
  width = "100%",
  height = "16px",
  rounded = "md",
  className = "",
}) {
  const roundedClass =
    rounded === "full"
      ? "rounded-full"
      : rounded === "lg"
      ? "rounded-lg"
      : rounded === "md"
      ? "rounded-md"
      : "rounded";

  return (
    <div
      className={`relative overflow-hidden ${roundedClass} ${className}`}
      style={{
        width,
        height,
        background: "#e5e7eb", // base color
      }}
    >
      {/* Dual mirror shines for more realistic effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-70"
        style={{
          animation: "mirrorShinePrimary 2.5s ease-in-out infinite",
          transform: "skewX(-15deg)",
        }}
      />
      <div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50"
        style={{
          animation: "mirrorShineSecondary 2.5s ease-in-out 0.5s infinite",
          transform: "skewX(-15deg)",
        }}
      />
      
      <style>{`
        @keyframes mirrorShinePrimary {
          0% {
            transform: translateX(-150%) skewX(-15deg);
          }
          70% {
            transform: translateX(150%) skewX(-15deg);
          }
          100% {
            transform: translateX(150%) skewX(-15deg);
          }
        }

        @keyframes mirrorShineSecondary {
          0% {
            transform: translateX(-150%) skewX(-15deg);
          }
          70% {
            transform: translateX(150%) skewX(-15deg);
          }
          100% {
            transform: translateX(150%) skewX(-15deg);
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .dark & {
            background: #374151;
          }
          .dark & > div:first-child {
            background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.4), transparent);
          }
          .dark & > div:last-child {
            background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
          }
        }
      `}</style>
    </div>
  );
}