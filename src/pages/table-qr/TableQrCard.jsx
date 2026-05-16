import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  QrCode,
  RefreshCw,
  Wand2,
} from "lucide-react";
import React, { useState } from "react";
import StatusBadge from "../../layout/StatusBadge";

// ─── QR Card ──────────────────────────────────────────────────────────────────
function TableQrCard({ table, onGenerate, onDownload, tableQrToDownload }) {
  const [copied, setCopied] = useState(false);
  const hasQr = table?.qrStatus === "available";

  const handleCopy = () => {
    navigator.clipboard.writeText(table.qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className={`group bg-white rounded-2xl border overflow-hidden flex flex-col transition-all duration-200
        ${
          hasQr
            ? "border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5"
            : "border-dashed border-slate-300 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100/50 hover:-translate-y-0.5"
        }`}
    >
      {/* ── QR Image Area ── */}
      <div
        className={`relative flex items-center justify-center border-b border-slate-100
          ${hasQr ? "bg-white" : "bg-slate-50"}`}
        style={{ height: 156 }}
      >
        {hasQr ? (
          <>
            <div className="p-4">
              <img
                src={table.qrImagePath}
                alt={table.tableName}
                className="w-28 h-28 object-contain rounded-xl"
              />
            </div>

            {/* Hover action overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.03] transition-colors duration-200" />
            <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 -translate-y-1 transition-all duration-200">
              <a
                href={table.qrUrl}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 bg-white border border-slate-200 shadow-sm rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                title="Open URL"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl border border-dashed border-slate-300 bg-white flex items-center justify-center">
              <QrCode size={22} className="text-slate-300" />
            </div>
            <p className="text-[11px] font-semibold text-slate-400">
              Not generated
            </p>
          </div>
        )}
      </div>

      {/* ── Info + Actions ── */}
      <div className="px-4 py-4 flex flex-col gap-3 flex-1">
        {/* Table name + status */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-black text-slate-900 leading-none truncate">
              {table.tableName}
            </p>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">
              {table.tableNumber}
            </p>
          </div>
          <StatusBadge
            value={hasQr}
            trueText="Available"
            falseText="Unavailable"
            size="sm"
          />
        </div>

        {/* Actions */}
        {hasQr ? (
          <div className="flex items-center gap-1.5">
            {/* Download */}
            <button
              onClick={() => onDownload({ table })}
              disabled={tableQrToDownload}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {tableQrToDownload === table.tableId ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Download size={12} />
              )}
              Download
            </button>

            {/* Copy */}
            <button
              onClick={handleCopy}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shrink-0"
              title="Copy URL"
            >
              {copied ? (
                <Check size={13} className="text-emerald-500" />
              ) : (
                <Copy size={13} />
              )}
            </button>

            {/* Regenerate */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onGenerate(table);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shrink-0"
              title="Regenerate"
            >
              <RefreshCw size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onGenerate(table);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-orange-500 text-white text-xs font-bold transition-all duration-200 shadow-sm active:scale-[0.98]"
          >
            <Wand2 size={12} /> Generate QR
          </button>
        )}
      </div>
    </div>
  );
}

export default TableQrCard;
