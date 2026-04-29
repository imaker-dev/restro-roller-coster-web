import { Paperclip, X } from "lucide-react";
import { formatFileSize, getFileIcon } from "../../utils/fileUtils";

// ─── File Preview Strip ───────────────────────────────────────────────────────
const FilePreviewStrip = ({ files, onRemove, onAddMore }) => (
  <div className="flex gap-2 overflow-x-auto py-1 px-0.5 hide-scrollbar">
    {files.map((f, i) => {
      const isImage = f.type?.startsWith("image/");
      const icon = getFileIcon(f.name);
      return (
        <div key={i} className="relative shrink-0 group">
          <div
            className={`w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-200 flex items-center justify-center bg-gray-50 transition-all group-hover:border-primary-300`}
          >
            {isImage && f.preview ? (
              <img
                src={f.preview}
                alt={f.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <img src={icon} alt="icon" className="w-8 h-8" />
            )}
          </div>

          {/* File name */}
          <p className="text-[9px] text-gray-500 truncate w-14 mt-1 text-center leading-tight">
            {f.name.length > 10
              ? f.name.slice(0, 8) + "…"
              : f.name.split(".")[0]}
          </p>

          {/* Size badge */}
          <div className="absolute bottom-5 right-0 bg-black/60 text-white text-[8px] px-1 py-0.5 rounded leading-none opacity-0 group-hover:opacity-100 transition-opacity">
            {formatFileSize(f.size)}
          </div>

          {/* Remove button */}
          <button
            onClick={() => onRemove(i)}
            className="absolute -top-1 -right-1 w-4 h-4 bg-gray-800 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm"
          >
            <X size={9} />
          </button>
        </div>
      );
    })}

    {/* Add more */}
    <label className="shrink-0 w-14 h-14 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-400 hover:bg-primary-50/30 flex items-center justify-center cursor-pointer transition-all group">
      <Paperclip
        size={16}
        className="text-gray-400 group-hover:text-primary-500 transition-colors"
      />

      <input type="file" multiple className="hidden" onChange={onAddMore} />
    </label>
  </div>
);

export default FilePreviewStrip;
