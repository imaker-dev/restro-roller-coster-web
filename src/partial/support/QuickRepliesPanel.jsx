import { ChevronRight, Reply, X } from "lucide-react";
import { useEffect, useRef } from "react";

const QUICK_REPLIES = [
  { id: 1, text: "Hello! How can I help you today?" },
  {
    id: 2,
    text: "I understand your concern. Let me look into this for you.",
  },
  {
    id: 3,

    text: "Could you please share your order number?",
  },
  {
    id: 4,
    text: "Your issue has been escalated to our team.",
  },
  {
    id: 5,
    text: "Your refund will be processed within 3–5 business days.",
  },
  {
    id: 6,
    text: "Is there anything else I can help you with?",
  },
  {
    id: 7,
    text: "Thank you for contacting support. We'll get back to you shortly.",
  },
];

// ─── Quick Replies Panel ──────────────────────────────────────────────────────
const QuickRepliesPanel = ({ onSelect, onClose }) => {
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="absolute bottom-full left-0 right-0 mb-3 bg-white rounded-2xl overflow-hidden z-20 border border-gray-100"
      style={{
        boxShadow: "0 -8px 40px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-6 h-6 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
            <Reply size={12} className="text-primary-500" />
          </div>
          <p className="text-xs font-black text-gray-900">Quick Replies</p>
        </div>

        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors shrink-0"
        >
          <X size={13} className="text-gray-400" />
        </button>
      </div>

      {/* List */}
      <div className="max-h-56 overflow-y-auto">
        {QUICK_REPLIES.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-1.5">
            <Search size={18} className="text-gray-300" />
            <p className="text-xs text-gray-400 font-medium">
              No replies found
            </p>
          </div>
        ) : (
          QUICK_REPLIES.map((r, i) => (
            <button
              key={r.id}
              onClick={() => {
                onSelect(r.text);
                onClose();
              }}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors group ${i < QUICK_REPLIES.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              <p className="flex-1 text-xs text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                {r.text}
              </p>
              <ChevronRight
                size={13}
                className="text-gray-300 group-hover:text-primary-400 transition-colors shrink-0 mt-0.5"
              />
            </button>
          ))
        )}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
        <p className="text-[10px] text-gray-400 text-center">
          {QUICK_REPLIES.length} repl{QUICK_REPLIES.length === 1 ? "y" : "ies"}{" "}
          · Click to insert into message
        </p>
      </div>
    </div>
  );
};

export default QuickRepliesPanel;