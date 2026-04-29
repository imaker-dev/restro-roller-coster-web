import React from "react";

function getColorFromName(name = "") {
  const colors = [
    "#D32F2F",
    "#C2185B",
    "#7B1FA2",
    "#512DA8",
    "#303F9F",
    "#1976D2",
    "#0288D1",
    "#0097A7",
    "#00796B",
    "#388E3C",
    "#689F38",
    "#F57C00",
    "#E64A19",
    "#5D4037",
    "#455A64",
  ];

  if (!name) return "#9E9E9E";

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

export default function UserAvatar({
  url,
  name = "",
  status = false,
  size = "md",
  className = "",
  rounded = true,
  preview = false,
}) {
const sizes = {
  sm: "w-8 h-8 text-[11px]",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base", 
  xl: "w-16 h-16 text-lg",   
};

const dotSizes = {
  sm: "w-2 h-2 border",
  md: "w-2.5 h-2.5 border-2",
  lg: "w-3 h-3 border-2",
  xl: "w-3.5 h-3.5 border-2",
};

  function getInitials(name = "") {
    if (!name) return "?";

    const words = name.trim().split(" ").filter(Boolean);

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }

    // Take first 2 words only
    return words[0][0].toUpperCase() + words[1][0].toUpperCase();
  }

  const letter = getInitials(name);
  const bgColor = getColorFromName(name);

  const handlePreview = () => {
    if (preview && url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="relative shrink-0">
      <div
        title={name}
        onClick={handlePreview}
        className={`
          ${sizes[size]} ${className}
          relative inline-flex items-center justify-center
          overflow-hidden shadow-sm ring-1 ring-black/5 select-none
          ${rounded ? "rounded-full" : "rounded-md"}
          ${preview ? "cursor-pointer" : "cursor-default"}
        `}
      >
        {url ? (
          <img
            src={url}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = "")}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center font-bold  text-white"
            style={{ backgroundColor: bgColor }}
          >
            {letter}
          </div>
        )}
      </div>

      {/* ✅ ONLINE DOT */}
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${dotSizes[size]} bg-emerald-400 border-white rounded-full`}
        />
      )}
    </div>
  );
}
