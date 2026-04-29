import { Download } from "lucide-react";
import { formatFileSize, getFileIcon } from "../../utils/fileUtils";

// ─── File Bubble ──────────────────────────────────────────────────────────────
export const FileBubble = ({ file, isOut,time, status  }) => {
  const isImage = file.type?.startsWith("image/");
  const icon = getFileIcon(file.name); // ✅ string path

  if (isImage && file.preview)
    return (
      <div className="rounded-xl overflow-hidden max-w-[220px] cursor-pointer">
        <img
          src={file.preview}
          alt={file.name}
          className="w-full object-cover rounded-xl"
          onError={(e) => {
            e.currentTarget.onerror = null; // prevent loop
            e.currentTarget.src = "/Icons/image.png";
          }}
        />
        <div
          className={`flex items-center justify-between gap-1 px-2 py-1 ${
            isOut ? "bg-[#005c4b]" : "bg-gray-100"
          }`}
        >
          <span
            className={`text-[10px] truncate flex-1 ${
              isOut ? "text-emerald-200" : "text-gray-500"
            }`}
          >
            {file.name}
          </span>
          <Download
            size={11}
            className={isOut ? "text-emerald-300" : "text-gray-400"}
          />
        </div>
      </div>
    );

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl min-w-[200px] max-w-[260px] ${
        isOut ? "bg-primary-500" : "bg-gray-100"
      }`}
    >
      {/* ✅ ICON FIX */}
      <div className={`rounded-lg grid place-items-center shrink-0 `}>
        <img src={icon} alt="file icon" className="w-7 h-7 object-contain" />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-xs font-semibold truncate ${
            isOut ? "text-white" : "text-gray-900"
          }`}
        >
          {file.name}
        </p>
        <p
          className={`text-[10px] mt-0.5 ${
            isOut ? "text-primary-100" : "text-gray-400"
          }`}
        >
          {formatFileSize(file.size)}
        </p>
      </div>

      <button
        className={`shrink-0 p-1 rounded-lg transition-colors ${
          isOut ? "hover:bg-white/10" : "hover:bg-gray-200"
        }`}
      >
        <Download
          size={13}
          className={isOut ? "text-white" : "text-gray-500"}
        />
      </button>
    </div>
  );
};
