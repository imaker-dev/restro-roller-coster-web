import React, { useState, useEffect } from "react";
import ModalBlank from "../../components/ModalBlank";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Circle,
  XCircle,
  Zap,
  Loader2,
} from "lucide-react";

const STATUS_CONFIG = {
  urgent: {
    label: "Urgent",
    description: "Requires immediate attention",
    icon: Zap,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
    btnBg: "bg-red-600 hover:bg-red-700",
  },
  open: {
    label: "Open",
    description: "Actively being worked on",
    icon: Circle,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
    btnBg: "bg-blue-600 hover:bg-blue-700",
  },
  resolved: {
    label: "Resolved",
    description: "Issue has been resolved",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    btnBg: "bg-emerald-600 hover:bg-emerald-700",
  },
  closed: {
    label: "Closed",
    description: "No further replies permitted",
    icon: XCircle,
    color: "text-gray-500",
    bg: "bg-gray-50",
    border: "border-gray-200",
    dot: "bg-gray-400",
    btnBg: "bg-gray-700 hover:bg-gray-800",
  },
};

const SupportStatusModal = ({
  isOpen,
  onClose,
  current,
  onSubmit,
  loading = false,
}) => {
  const [selected, setSelected] = useState(current);
  const hasChanged = selected !== current;
  const cfg = STATUS_CONFIG[selected];

  useEffect(() => {
    if (isOpen) setSelected(current);
  }, [isOpen, current]);

  const handleConfirm = () => {
    if (hasChanged && !loading) onSubmit(selected);
  };

  return (
    <ModalBlank
      id="support-status-change-modal"
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Update Ticket Status
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Choose a status to apply to this ticket
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
        >
          <X size={15} />
        </button>
      </div>

      {/* Status options */}
      <div className="px-4 py-3 space-y-1.5">
        {Object.entries(STATUS_CONFIG).map(([key, val]) => {
          const isActive = key === selected;
          const isCurrent = key === current;

          return (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all text-left ${
                isActive
                  ? `${val.bg} ${val.border}`
                  : "bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200"
              }`}
            >
              {/* status dot */}
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? val.dot : "bg-gray-200"}`}
              />

              {/* label + description */}
              <div className="flex-1 flex items-center gap-1.5 min-w-0 overflow-hidden">
                <span
                  className={`text-sm font-medium flex-shrink-0 ${isActive ? val.color : "text-gray-700"}`}
                >
                  {val.label}
                </span>
                <span
                  className={`text-xs truncate ${isActive ? val.color + " opacity-60" : "text-gray-400"}`}
                >
                  - {val.description}
                </span>
                {isCurrent && (
                  <span className="ml-auto flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                    Current
                  </span>
                )}
              </div>

              {/* checkmark */}
              {isActive && (
                <CheckCircle2
                  size={15}
                  className={`flex-shrink-0 ${val.color}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Closed warning */}
      {selected === "closed" && (
        <div className="px-4 pb-1">
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
            <AlertTriangle
              size={13}
              className="text-amber-500 flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-amber-700 leading-relaxed">
              Closing this ticket will disable further messaging. It can be
              reopened if needed.
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-4 flex gap-2 border-t border-gray-100 mt-2">
        <button
          onClick={onClose}
          disabled={loading}
          className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-600 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          onClick={handleConfirm}
          disabled={!hasChanged || loading}
          className={`flex-1 py-2 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-1.5 ${
            !hasChanged || loading
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : cfg?.btnBg
          }`}
        >
          {loading ? (
            <>
              <Loader2 size={13} className="animate-spin" /> Saving…
            </>
          ) : (
            "Confirm"
          )}
        </button>
      </div>
    </ModalBlank>
  );
};

export default SupportStatusModal;
