import {
  AlertTriangle,
  CloudUpload,
  FileCheck,
  Loader2,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";

export default function UploadSection({ onFileSelected, isValidating }) {
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const accept = (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["csv"].includes(ext)) return;
    setSelectedFile(file);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    accept(e.dataTransfer.files[0]);
  }, []);
  const fmt = (b) =>
    b < 1024
      ? `${b} B`
      : b < 1048576
        ? `${(b / 1024).toFixed(1)} KB`
        : `${(b / 1048576).toFixed(1)} MB`;

  return (
    <div className="space-y-4">
      <div
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onClick={() => !selectedFile && fileRef.current?.click()}
        className={`rounded-2xl border-2 border-dashed transition-all duration-200
          ${
            dragging
              ? "border-primary-400 bg-primary-50 scale-[1.01]"
              : selectedFile
                ? "border-emerald-300 bg-emerald-50 cursor-default"
                : "border-slate-300 bg-slate-50 hover:border-primary-300 hover:bg-primary-50/40 cursor-pointer"
          }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => accept(e.target.files[0])}
        />
        <div className="px-8 py-14 flex flex-col items-center text-center">
          {selectedFile ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center mb-4 shadow-lg">
                <FileCheck size={30} className="text-white" strokeWidth={1.6} />
              </div>
              <div className="text-[15px] font-bold text-emerald-700 mb-0.5">
                {selectedFile.name}
              </div>
              <div className="text-[12px] text-emerald-600 mb-4">
                {fmt(selectedFile.size)} · Ready to validate
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-red-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Trash2 size={11} /> Remove file
              </button>
            </>
          ) : (
            <>
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${dragging ? "bg-primary-500 shadow-xl scale-110" : "bg-slate-200"}`}
              >
                <CloudUpload
                  size={30}
                  className={dragging ? "text-white" : "text-slate-500"}
                  strokeWidth={1.5}
                />
              </div>
              <div className="text-[15px] font-bold text-slate-700 mb-1">
                {dragging ? "Drop it here!" : "Drag & drop your file"}
              </div>
              <div className="text-[12px] text-slate-400 mb-4">
                or click to browse from your computer
              </div>
              <div className="flex items-center gap-2">
                {[".csv"].map((ext) => (
                  <span
                    key={ext}
                    className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-lg"
                  >
                    {ext}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {selectedFile && (
        <button
          onClick={() => onFileSelected(selectedFile)}
          disabled={isValidating}
          className="btn w-full flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[14px] py-3.5 rounded-xl disabled:opacity-60 transition-all"
        >
          {isValidating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Validating your file...
            </>
          ) : (
            <>
              <ShieldCheck size={16} />
              Validate File
            </>
          )}
        </button>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5 flex gap-3">
        <AlertTriangle
          size={14}
          className="text-amber-500 flex-shrink-0 mt-0.5"
        />
        <p className="text-[12px] text-amber-800 leading-relaxed">
          <span className="font-bold">Tip:</span> Use the exact template from
          Step 1. Do not rename columns or change row type identifiers
          (CATEGORY, ITEM, VARIANT, ADDON_GROUP, ADDON).
        </p>
      </div>
    </div>
  );
}
