import { useEffect } from "react";
import { Loader2, QrCode, ScanLine, Wand2, X, Hash, Tag } from "lucide-react";
import ModalBlank from "../../components/ModalBlank";

export default function GenerateSingleTableQrModal({
  isOpen,
  onClose,
  table,
  outletId,
  baseUrl,
  loading,
  onGenerate,
}) {
  const fullUrl = `${baseUrl}?outlet=${outletId}&table=${table?.tableId}`;

  return (
    <ModalBlank
      id={"generate-single-table-qr"}
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      {/* Card */}
      <div>
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500">
              <QrCode
                className="h-[18px] w-[18px] text-white"
                strokeWidth={2}
              />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-gray-900">
                Generate QR Code
              </p>
              <p className="text-[12px] text-gray-400">
                Create a scannable code for this table
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
          {/* Table info card */}
          <div className="flex items-center gap-4 rounded-xl bg-gray-50 px-5 py-4 ring-1 ring-gray-100">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
              <QrCode className="h-6 w-6 text-gray-400" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold text-gray-900">
                {table?.tableName}
              </p>
              <div className="mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1 text-[11.5px] text-gray-400">
                  <Hash className="h-3 w-3" strokeWidth={2.5} />
                  {table?.tableNumber}
                </span>
                <span className="h-3 w-px bg-gray-200" />
                <span className="flex items-center gap-1 text-[11.5px] text-gray-400">
                  <Tag className="h-3 w-3" strokeWidth={2.5} />
                  ID: {table?.tableId}
                </span>
              </div>
            </div>
          </div>

          {/* URL preview */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <div className="mb-1.5 flex items-center gap-1.5">
              <ScanLine className="h-3 w-3 text-gray-400" strokeWidth={2} />
              <p className="text-[10.5px] font-semibold uppercase tracking-widest text-gray-400">
                QR links to
              </p>
            </div>
            <p className="break-all text-[12px] font-medium leading-relaxed text-gray-500">
              {fullUrl}
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center gap-2.5 border-t border-gray-100 bg-gray-50/60 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="btn flex-1  border border-gray-200 bg-white py-2.5 text-gray-600  hover:bg-gray-50 hover:text-gray-900 "
          >
            Cancel
          </button>

          <button
            onClick={onGenerate}
            disabled={loading}
            className="btn flex flex-[2] items-center justify-center gap-2 bg-primary-500 py-2.5 text-white shadow-sm  hover:bg-primary-600  disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" strokeWidth={2} />
                Generate QR Code
              </>
            )}
          </button>
        </div>
      </div>
    </ModalBlank>
  );
}
