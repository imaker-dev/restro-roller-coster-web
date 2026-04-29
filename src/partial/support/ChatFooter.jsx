// ─── ChatFooter.jsx ───────────────────────────────────────────────────────────
import { useState, useRef, useEffect } from "react";
import { Paperclip, Send, Mic, Reply, X, Loader2 } from "lucide-react";
import QuickRepliesPanel from "./QuickRepliesPanel";
import FilePreviewStrip from "./FilePreviewStrip";

// ─── MAIN CHAT FOOTER ─────────────────────────────────────────────────────────
export const ChatFooter = ({
  input,
  setInput,
  pendingFiles,
  setPendingFiles,
  onSend,
  sending,
  disabled = false,
}) => {
  const textareaRef = useRef();
  const fileInputRef = useRef();
  const footerRef = useRef();
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  // Close quick replies on outside click
  useEffect(() => {
    const handler = (e) => {
      if (footerRef.current && !footerRef.current.contains(e.target)) {
        setShowQuickReplies(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
    if (e.key === "Escape") setShowQuickReplies(false);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const mapped = files.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      file: f,
      preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
    }));
    setPendingFiles((p) => [...p, ...mapped]);
    e.target.value = "";
  };

  const hasContent = input.trim() || pendingFiles.length > 0;
  const hasPendingFiles = pendingFiles.length > 0;

  return (
    <div
      ref={footerRef}
      className="relative bg-[#f0f2f5] border-t border-gray-200 px-3 pb-3 pt-2.5 shrink-0"
    >
      {/* Quick Replies panel — floats above footer */}
      {showQuickReplies && (
        <QuickRepliesPanel
          onSelect={(text) => {
            setInput(text);
            setShowQuickReplies(false);
            textareaRef.current?.focus();
          }}
          onClose={() => setShowQuickReplies(false)}
        />
      )}

      {/* Main input shell */}
      <div
        className={`bg-white rounded-2xl transition-all duration-200 ${
          isFocused
            ? "shadow-lg ring-2 ring-primary-200 ring-offset-1"
            : "shadow-sm"
        }`}
      >
        {/* File preview strip — inside the box */}
        {hasPendingFiles && (
          <div className="px-3 pt-3 pb-0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-gray-500 flex items-center gap-1.5">
                <Paperclip size={10} />
                {pendingFiles.length} file{pendingFiles.length > 1 ? "s" : ""}{" "}
                attached
              </p>
              <button
                onClick={() => setPendingFiles([])}
                className="text-[10px] font-bold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                <X size={10} /> Clear all
              </button>
            </div>
            <FilePreviewStrip
              files={pendingFiles}
              onRemove={(i) =>
                setPendingFiles((p) => p.filter((_, idx) => idx !== i))
              }
              onAddMore={handleFileChange}
            />
            {/* Divider */}
            <div className="border-b border-gray-100 mt-2.5" />
          </div>
        )}

        {/* Textarea row */}
        <div className="flex items-end gap-2 px-3 py-2.5">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              disabled
                ? "Messaging is disabled for closed tickets"
                : "Type a message..."
            }
            disabled={disabled}
            rows={1}
            className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none resize-none leading-relaxed bg-transparent pt-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ maxHeight: "120px" }}
          />
        </div>

        {/* Bottom toolbar — always inside the box */}
        <div className="flex items-center justify-between px-3 pb-2.5 pt-0">
          {/* Left: action buttons */}
          <div className="flex items-center gap-0.5">
            {/* Quick Replies */}
            <button
              type="button"
              disabled={disabled}
              onClick={() => setShowQuickReplies((s) => !s)}
              title="Quick Replies"
              className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                showQuickReplies
                  ? "bg-primary-500 text-white shadow-sm shadow-primary-200"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Reply size={15} />
            </button>

            {/* Attach file */}
            <button
              type="button"
              disabled={disabled}
              onClick={() => fileInputRef.current?.click()}
              title="Attach file"
              className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Paperclip size={15} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {/* File count pill */}
            {hasPendingFiles && (
              <span className="ml-1 flex items-center gap-1 text-[10px] font-bold text-primary-600 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded-full">
                <Paperclip size={9} />
                {pendingFiles.length}
              </span>
            )}
          </div>

          {/* Right: char count + send */}
          <div className="flex items-center gap-2">
            {/* Character count */}
            {input.length > 0 && (
              <span
                className={`text-[10px] font-medium tabular-nums ${input.length > 900 ? "text-red-500" : "text-gray-300"}`}
              >
                {input.length}
              </span>
            )}

            {/* Keyboard hint — only on desktop, only when focused */}
            {isFocused && !hasPendingFiles && input.length === 0 && (
              <span className="hidden sm:flex items-center gap-1 text-[10px] text-gray-300">
                <kbd className="bg-gray-100 border border-gray-200 px-1 py-0.5 rounded text-[9px] font-mono text-gray-400">
                  ⏎
                </kbd>
                <span>send</span>
                <span className="text-gray-200">·</span>
                <kbd className="bg-gray-100 border border-gray-200 px-1 py-0.5 rounded text-[9px] font-mono text-gray-400">
                  ⇧⏎
                </kbd>
                <span>newline</span>
              </span>
            )}

            {/* Send / Mic button */}
            {hasContent ? (
              <button
                onClick={onSend}
                disabled={sending || disabled}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-primary-500 hover:bg-primary-600 text-white transition-all shadow-sm shadow-primary-200 disabled:opacity-60 active:scale-95"
              >
                {sending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} className="translate-x-px" />
                )}
              </button>
            ) : (
              <button
                disabled={disabled}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Mic size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatFooter;
