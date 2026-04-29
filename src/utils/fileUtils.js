export const formatFileSize = (bytes, roundUp = false) => {
  if (typeof bytes !== "number" || isNaN(bytes) || bytes < 0)
    return "Invalid size";
  if (bytes === 0) return "0 KB"; //  no Bytes

  const k = 1024;
  const sizes = ["KB", "MB", "GB", "TB"];

  //  force minimum index = 1 (KB)
  const i =
    Math.max(
      1,
      Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length),
    ) - 1;

  const size = bytes / Math.pow(k, i + 1); // adjust power

  const formatted = roundUp ? Math.ceil(size) : size.toFixed(2);

  return `${formatted} ${sizes[i]}`;
};

export function getFileIcon(filename) {
  const ext = filename.split(".").pop()?.toLowerCase() || "";

  const groups = [
    { exts: ["pdf"], icon: "/Icons/pdf.png" },
    { exts: ["doc", "docx", "txt"], icon: "/Icons/doc.png" },
    { exts: ["xls", "xlsx", "csv"], icon: "/Icons/xls.png" },
    { exts: ["jpg", "jpeg", "png", "gif", "webp"], icon: "/Icons/image.png" },
    { exts: ["mp4", "mkv", "avi", "mov"], icon: "/Icons/video.png" },
    { exts: ["mp3", "wav", "ogg"], icon: "/Icons/audio.png" },
    { exts: ["zip", "rar", "7z", "tar"], icon: "/Icons/zip.png" },
  ];

  const match = groups.find((group) => group.exts.includes(ext));
  return match ? match.icon : "/Icons/default.png"; // ✅ fallback added
}
