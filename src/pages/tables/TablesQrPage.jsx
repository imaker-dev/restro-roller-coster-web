import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllTableQr,
  generateAllTableQr,
  generateSingleTableQr,
} from "../../redux/slices/qrSlice";
import {
  QrCode,
  Download,
  RefreshCw,
  ExternalLink,
  X,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  Layers,
  ArrowDownToLine,
  ScanLine,
  Wand2,
  RotateCcw,
} from "lucide-react";
import StatusBadge from "../../layout/StatusBadge";
import NoDataFound from "../../layout/NoDataFound";
import { handleResponse } from "../../utils/helpers";

// const BASE_URL = window.location.origin;
const BASE_URL =
  "https://completing-allocated-hispanic-chassis.trycloudflare.com";

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyBtn({ text }) {
  const [done, setDone] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  };
  return (
    <button
      onClick={copy}
      title="Copy URL"
      className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors shrink-0"
    >
      {done ? (
        <Check size={11} className="text-emerald-500" />
      ) : (
        <Copy size={11} className="text-slate-400" />
      )}
    </button>
  );
}

// ─── Single generate modal (Presentational) ───────────────────────────────────
function GenerateModal({
  isOpen,
  onClose,
  table,
  outletId,
  baseUrl,
  loading,
  onGenerate,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl shadow-slate-900/10 w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center">
              <QrCode size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 leading-none">
                Generate QR Code
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {table?.tableName} · {table?.tableNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X size={13} className="text-slate-600" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* URL preview */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 space-y-1.5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              QR links to
            </p>
            <div className="flex items-center gap-2">
              <ScanLine size={11} className="text-slate-400 shrink-0" />
              <p className="text-xs text-slate-600 font-medium break-all">
                {baseUrl}?outlet={outletId}&table={table?.tableId}
              </p>
            </div>
          </div>

          <button
            onClick={onGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-slate-900 hover:bg-orange-500 disabled:opacity-60 text-white text-sm font-bold transition-all duration-200 shadow-lg active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Wand2 size={15} /> Generate QR Code
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Generate all modal (Presentational) ──────────────────────────────────────
function GenerateAllModal({
  isOpen,
  onClose,
  total,
  baseUrl,
  loading,
  onGenerate,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl shadow-slate-900/10 w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/20">
              <Layers size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 leading-none">
                Generate All QRs
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {total} tables will be updated
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X size={13} className="text-slate-600" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3.5">
            <p className="text-xs font-semibold text-amber-700 leading-relaxed">
              This will regenerate QR codes for{" "}
              <span className="font-black">all {total} tables</span>, including
              ones already generated.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 space-y-1.5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Base URL
            </p>
            <div className="flex items-center gap-2">
              <ScanLine size={11} className="text-slate-400 shrink-0" />
              <p className="text-xs text-slate-600 font-medium truncate">
                {baseUrl}
              </p>
            </div>
          </div>

          <button
            onClick={onGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-bold transition-all duration-200 shadow-lg shadow-orange-500/20 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Wand2 size={15} /> Generate for All Tables
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── QR Card ──────────────────────────────────────────────────────────────────
function QrCard({ table, onGenerate }) {
  const hasQr = table?.qrStatus === "available";

  return (
    <div
      className={`group bg-white rounded-2xl border overflow-hidden flex flex-col transition-all duration-200
      ${
        hasQr
          ? "border-slate-200 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-0.5"
          : "border-dashed border-slate-300 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100/50 hover:-translate-y-0.5"
      }`}
    >
      {/* QR area */}
      <div
        className={`relative flex items-center justify-center ${hasQr ? "bg-white" : "bg-gradient-to-br from-slate-50 to-orange-50/40"}`}
        style={{ height: 152 }}
      >
        {hasQr ? (
          <>
            <div className="p-4">
              <img
                src={table?.qrImagePath}
                alt={table?.tableName}
                className="w-28 h-28 object-contain rounded-xl"
              />
              <div className="hidden w-28 h-28 bg-slate-100 rounded-xl items-center justify-center">
                <QrCode size={32} className="text-slate-300" />
              </div>
            </div>

            {/* Hover actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.04] transition-colors rounded-t-2xl" />
            <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
              <a
                href={table?.qrImagePath}
                download={`QR_${table.tableNumber}.png`}
                className="w-7 h-7 bg-white shadow-md rounded-xl flex items-center justify-center hover:bg-slate-50 transition-colors"
                title="Download QR"
              >
                <ArrowDownToLine size={12} className="text-slate-600" />
              </a>
              <a
                href={table.qrUrl}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 bg-white shadow-md rounded-xl flex items-center justify-center hover:bg-slate-50 transition-colors"
                title="Open link"
              >
                <ExternalLink size={12} className="text-slate-600" />
              </a>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2.5">
            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-white">
              <QrCode size={24} className="text-slate-300" />
            </div>
            <p className="text-[11px] text-slate-400 font-semibold">
              Not generated
            </p>
          </div>
        )}
      </div>

      <div className="h-px bg-slate-100" />

      {/* Info + actions */}
      <div className="px-4 py-3.5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-black text-slate-900 leading-none truncate">
              {table.tableName}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
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

        {table.qrUrl && (
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
            <ScanLine size={10} className="text-slate-400 shrink-0" />
            <p className="text-[10px] text-slate-500 truncate flex-1 font-medium">
              {table.qrUrl.replace(/https?:\/\//, "")}
            </p>
            <CopyBtn text={table.qrUrl} />
          </div>
        )}

        {hasQr ? (
          <div className="flex gap-2">
            <a
              href={table.qrImagePath}
              download={`QR_${table.tableNumber}.png`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              <Download size={12} /> Download
            </a>
            <button
              onClick={() => onGenerate(table)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 text-xs hover:bg-slate-50 transition-colors"
              title="Regenerate"
            >
              <RefreshCw size={12} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onGenerate(table)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-orange-500 text-white text-xs font-bold transition-all duration-200 shadow-sm active:scale-[0.98]"
          >
            <Wand2 size={12} /> Generate QR
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="bg-slate-100" style={{ height: 152 }} />
      <div className="h-px bg-slate-100" />
      <div className="px-4 py-3.5 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <div className="h-3 bg-slate-100 rounded-full w-20" />
            <div className="h-2.5 bg-slate-100 rounded-full w-12" />
          </div>
          <div className="h-5 bg-slate-100 rounded-full w-14" />
        </div>
        <div className="h-8 bg-slate-100 rounded-xl" />
        <div className="h-9 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const TablesQrPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((s) => s.auth);
  const {
    isFetchingAllTableQr,
    allTablesQr,
    isGeneratingSingleQr,
    generatedQr,
    isGeneratingBulkQr,
    allQrGenerated,
  } = useSelector((s) => s.qr);

  // Single modal state
  const [modalState, setModalState] = useState({
    type: null, // null | 'single' | 'bulk'
    table: null,
  });

  const fetchQr = () => {
    dispatch(fetchAllTableQr({ outletId }));
  };

  useEffect(() => {
    if (!outletId) return;
    fetchQr();
  }, [outletId]);

  // Handlers
  const handleGenerateSingle = async () => {
    // Dispatch your API call here
    const values = {
      outletId,
      tableId: modalState.table?.tableId,
      baseUrl: BASE_URL,
    };

    await handleResponse(dispatch(generateSingleTableQr({ values })), () => {
      fetchQr();
      setModalState({
        type: null,
        table: null,
      });
    });
  };

  const handleGenerateAll = async () => {
    // Dispatch your API call here
    const values = {
      outletId,
      baseUrl: BASE_URL,
    };

    await handleResponse(dispatch(generateAllTableQr({ values })), () => {
      fetchQr();
      setModalState({
        type: null,
        table: null,
      });
    });
  };

  const handleCloseModal = () => {
    setModalState({ type: null, table: null });
  };

  const handleOpenSingleModal = (table) => {
    setModalState({ type: "single", table });
  };

  const handleOpenBulkModal = () => {
    setModalState({ type: "bulk", table: null });
  };

  const floors = allTablesQr?.floors ?? [];
  const allTables = floors.flatMap((f) => f.tables ?? []);

  const actions = [
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchQr,
      loading: isFetchingAllTableQr,
      loadingText: "Refreshing...",
    },
    {
      label: "Generate for All",
      type: "primary",
      icon: Wand2,
      onClick: handleOpenBulkModal,
      loading: isFetchingAllTableQr,
      loadingText: "Refreshing...",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Tables QR" actions={actions} />

      {/* Content */}
      {isFetchingAllTableQr ? (
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div key={i}>
              <div className="h-3 w-28 bg-slate-200 rounded-full animate-pulse mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {[...Array(5)].map((_, j) => (
                  <Skeleton key={j} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : floors.length === 0 ? (
        <NoDataFound
          icon={QrCode}
          title="No tables found"
          description="Tables will appear here once added to your outlet"
        />
      ) : (
        <div className="space-y-10">
          {floors.map((floor) => (
            <section key={floor.floorId}>
              {/* Floor label */}
              <div className="flex items-center gap-3 mb-4">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                  {floor.floorName}
                </p>
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
                  {(floor.tables ?? []).length} tables
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {(floor.tables ?? []).map((table) => (
                  <QrCard
                    key={table.tableId}
                    table={table}
                    onGenerate={handleOpenSingleModal}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Single QR Modal */}
      <GenerateModal
        isOpen={modalState.type === "single"}
        onClose={handleCloseModal}
        table={modalState.table}
        outletId={outletId}
        baseUrl={BASE_URL}
        loading={isGeneratingSingleQr}
        onGenerate={handleGenerateSingle}
      />

      {/* Generate All QR Modal */}
      <GenerateAllModal
        isOpen={modalState.type === "bulk"}
        onClose={handleCloseModal}
        total={allTables.length}
        baseUrl={BASE_URL}
        loading={isGeneratingBulkQr}
        onGenerate={handleGenerateAll}
      />
    </div>
  );
};

export default TablesQrPage;
