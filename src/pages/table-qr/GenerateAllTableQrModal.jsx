import { useEffect } from "react";
import {
  Loader2,
  Wand2,
  X,
  TriangleAlert,
  ScanLine,
  QrCode,
} from "lucide-react";
import ModalBlank from "../../components/ModalBlank";

export default function GenerateAllTableQrModal({
  isOpen,
  onClose,
  total,
  baseUrl,
  loading,
  onGenerate,
}) {
  return (
    <ModalBlank
      id={"generate-all-table-qr"}
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      {/* Card */}
      <div>
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 ring-1 ring-primary-100">
              <QrCode
                className="h-[18px] w-[18px] text-primary-500"
                strokeWidth={2}
              />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-gray-900">
                Generate All QR Codes
              </p>
              <p className="text-[12px] text-gray-400">
                {total} {total === 1 ? "table" : "tables"} will be updated
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 space-y-3">
          {/* Stat card */}
          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-5 py-4 ring-1 ring-gray-100">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                Total Tables
              </p>
              <p className="mt-0.5 text-4xl font-bold tracking-tight text-gray-900">
                {total}
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/10">
              <QrCode className="h-7 w-7 text-primary-500" strokeWidth={1.5} />
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3.5">
            <TriangleAlert
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
              strokeWidth={2}
            />
            <p className="text-[12.5px] leading-relaxed text-amber-800">
              All existing QR codes will be{" "}
              <span className="font-semibold">replaced</span>. Previously
              printed codes will stop working after this action.
            </p>
          </div>

          {/* Base URL */}
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <ScanLine
              className="h-4 w-4 shrink-0 text-gray-400"
              strokeWidth={2}
            />
            <div className="min-w-0">
              <p className="text-[10.5px] font-semibold uppercase tracking-widest text-gray-400">
                Base URL
              </p>
              <p className="mt-0.5 truncate text-[12.5px] font-medium text-gray-600">
                {baseUrl}
              </p>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center gap-2.5 border-t border-gray-100 bg-gray-50/60 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="btn flex-1 py-2.5 border border-gray-200 bg-white  text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 "
          >
            Cancel
          </button>

          <button
            onClick={onGenerate}
            disabled={loading}
            className="btn flex flex-[2] items-center justify-center gap-2 py-2.5 bg-primary-500 text-white shadow-sm shadow-primary-500/20 transition hover:bg-primary-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" strokeWidth={2} />
                Generate All QR
              </>
            )}
          </button>
        </div>
      </div>
    </ModalBlank>
  );
}
