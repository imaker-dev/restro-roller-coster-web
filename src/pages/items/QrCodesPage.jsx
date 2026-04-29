import React, { useState, useRef, useEffect, useCallback } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  QrCode,
  Download,
  Copy,
  Check,
  ImagePlus,
  RefreshCw,
  UtensilsCrossed,
  Wine,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Info,
  Eye,
  ZoomIn,
  ScanLine,
  Activity,
  Shield,
  Upload,
  Trash2,
  CheckCheck,
} from "lucide-react";
import LoadingOverlay from "../../components/LoadingOverlay";
import { handleResponse } from "../../utils/helpers";
import {
  fetchAllQrCodes,
  regenerateQr,
  uploadQrLogo,
} from "../../redux/slices/menuMediaSlice";
import { formatDate } from "../../utils/dateFormatter";
import ModalAction from "../../components/ModalAction";
import InfoCard from "../../components/InfoCard";

// ─── Constants ────────────────────────────────────────────────────────────────
const MENU_TYPE_META = {
  restaurant: {
    label: "Restaurant",
    icon: UtensilsCrossed,
    color: "emerald",
    desc: "Main dining menu QR",
  },
  bar: {
    label: "Bar",
    icon: Wine,
    color: "violet",
    desc: "Bar & drinks menu QR",
  },
};

const COLOR_MAP = {
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    iconBg: "bg-emerald-100",
    btn: "bg-emerald-600 hover:bg-emerald-700",
  },
  violet: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    iconBg: "bg-violet-100",
    btn: "bg-violet-600 hover:bg-violet-700",
  },
};

// ─── QR Preview Modal ─────────────────────────────────────────────────────────
const QrPreviewModal = ({ qrUrl, logoUrl, title, viewUrl, onClose }) => {
  if (!qrUrl) return null;
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (!viewUrl) return;
    navigator.clipboard.writeText(viewUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <QrCode size={15} className="text-gray-500" />
            <span className="font-bold text-sm text-gray-900">{title}</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={14} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="relative w-60 h-60 bg-white rounded-2xl border-2 border-gray-100 flex items-center justify-center p-3 shadow-inner">
            <img
              src={qrUrl}
              alt={title}
              className="w-full h-full object-contain"
            />
            {logoUrl && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-lg">
                  <img
                    src={logoUrl}
                    alt="logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 text-center">
            Scan with any camera app to open the digital menu
          </p>
          {viewUrl && (
            <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-center">
              <p className="text-[10px] text-gray-400 font-medium mb-0.5">
                Scan target URL
              </p>
              <div className="flex items-center gap-2">
                <p className="text-[11px] text-gray-600 font-mono truncate flex-1">
                  {viewUrl}
                </p>
                <button
                  onClick={handleCopy}
                  className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-all ${
                    copied
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                  }`}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Logo Upload Zone ─────────────────────────────────────────────────────────
// States: idle → selected (preview) → uploading → uploaded (success) | error
const LogoUploadZone = ({
  menuType,
  outletId,
  existingLogoUrl,
  onUploadSuccess,
}) => {
  const dispatch = useDispatch();
  const fileRef = useRef();

  const [state, setState] = useState("idle"); // idle | selected | uploading | success | error
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);

  // Reset to show existing logo
  const reset = useCallback(() => {
    setState("idle");
    setFile(null);
    setPreview(null);
    setErrMsg("");
    if (fileRef.current) fileRef.current.value = "";
  }, []);

  const pickFile = (f) => {
    if (!f || !f.type.startsWith("image/")) {
      setErrMsg("Only image files are allowed.");
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      setErrMsg("Image must be under 2 MB.");
      return;
    }
    setErrMsg("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setState("selected");
  };

  const handleInputChange = (e) => pickFile(e.target.files?.[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setState("uploading");
    const formData = new FormData();
    formData.append("logo", file);

    await handleResponse(
      dispatch(uploadQrLogo({ outletId, menuType, formData })),
      () => {
        setState("success");
        onUploadSuccess();
        // Auto-reset selection after 2s so card refreshes with new logo
        setTimeout(() => reset(), 2000);
      },
      () => {
        setState("error");
        setErrMsg("Upload failed. Please try again.");
      },
    );
  };

  // ── Render: success ──
  if (state === "success") {
    return (
      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-3">
        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
          <CheckCheck size={15} className="text-emerald-600" />
        </div>
        <div>
          <p className="text-xs font-bold text-emerald-700">
            Logo uploaded successfully
          </p>
          <p className="text-[10px] text-emerald-600">
            Regenerate the QR to embed it.
          </p>
        </div>
      </div>
    );
  }

  // ── Render: selected / uploading ──
  if (state === "selected" || state === "uploading" || state === "error") {
    const isUploading = state === "uploading";
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-2.5 shadow-sm">
          {/* Thumb */}
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200 shrink-0">
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Loader2 size={14} className="text-white animate-spin" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-800 truncate">
              {file?.name}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {file ? (file.size / 1024).toFixed(0) + " KB" : ""}
            </p>
            {state === "error" && (
              <p className="text-[10px] text-red-500 font-semibold mt-0.5">
                {errMsg}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {!isUploading && (
              <>
                <button
                  onClick={handleUpload}
                  className="flex items-center gap-1 text-[11px] font-bold text-white bg-gray-900 hover:bg-gray-800 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <Upload size={11} /> Upload
                </button>
                <button
                  onClick={reset}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={13} className="text-gray-400" />
                </button>
              </>
            )}
            {isUploading && (
              <span className="text-[11px] text-gray-400 font-medium">
                Uploading...
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Render: idle — show existing logo OR drop zone ──
  if (existingLogoUrl) {
    return (
      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-2.5">
        <img
          src={existingLogoUrl}
          alt="current logo"
          className="w-10 h-10 rounded-xl object-cover border border-gray-200 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-700">Current logo</p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Upload a new one to replace it
          </p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <ImagePlus size={11} /> Change
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
    );
  }

  // Drop zone
  return (
    <div>
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`w-full flex flex-col items-center justify-center gap-1.5 py-4 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
          dragOver
            ? "border-indigo-400 bg-indigo-50"
            : "border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${dragOver ? "bg-indigo-100" : "bg-white border border-gray-200"}`}
        >
          <ImagePlus
            size={15}
            className={dragOver ? "text-indigo-500" : "text-gray-400"}
          />
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold text-gray-600">
            {dragOver ? "Drop to select" : "Upload logo"}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            PNG, JPG · Max 2 MB
          </p>
        </div>
      </div>
      {errMsg && (
        <p className="text-[10px] text-red-500 font-semibold mt-1.5">
          {errMsg}
        </p>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
};

// ─── QR Card ──────────────────────────────────────────────────────────────────
const QrCard = ({
  menuType,
  outletId,
  qrData,
  onRegenerate,
  isRegenerating,
  onRefresh,
}) => {
  const meta = MENU_TYPE_META[menuType];
  const colors = COLOR_MAP[meta.color];
  const MetaIcon = meta.icon;

  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showRegenConfirm, setShowRegenConfirm] = useState(false);

  const hasQr = !!qrData?.qrUrl;
  const viewUrl = qrData?.view_url || null;
  const existingLogoUrl = qrData?.logoUrl || null;

  const handleCopy = () => {
    if (!viewUrl) return;
    navigator.clipboard.writeText(viewUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRegenerate = () => {
    setShowRegenConfirm(false);
    onRegenerate({ menuType });
  };

  const handleDownload = async () => {
    if (!qrData?.qrUrl) return;
    try {
      const res = await fetch(qrData.qrUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-${menuType}-menu.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(qrData.qrUrl, "_blank");
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div
          className={`flex items-center gap-3 px-5 py-4 border-b border-gray-100 `}
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${colors.border} ${colors.iconBg}`}
          >
            <MetaIcon size={16} className={colors.text} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm text-gray-900">
              {meta.label} Menu
            </p>
            <p className="text-[11px] text-gray-400">{meta.desc}</p>
          </div>
          {hasQr ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-white border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
              <CheckCircle2 size={10} className="text-emerald-500" /> Active
            </span>
          ) : (
            <span className="text-[10px] font-bold text-gray-400 bg-white border border-gray-200 px-2.5 py-1 rounded-full shrink-0">
              Not generated
            </span>
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col gap-4">
          {/* QR + Stats row */}
          <div className="flex gap-4 items-start">
            {/* QR Image */}
            <div className="shrink-0 flex flex-col items-center gap-1.5">
              <div
                className={`w-32 h-32 rounded-2xl border-2 overflow-hidden flex items-center justify-center relative transition-all ${
                  hasQr
                    ? "border-gray-200 bg-white cursor-pointer group hover:border-gray-300"
                    : "border-dashed border-gray-200 bg-gray-50"
                }`}
                onClick={() => hasQr && setShowPreview(true)}
              >
                {hasQr ? (
                  <>
                    <img
                      src={qrData.qrUrl}
                      alt={`${meta.label} QR`}
                      className="w-full h-full object-contain p-2"
                    />
                    {existingLogoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-8 h-8 rounded-lg overflow-hidden border-2 border-white shadow-md">
                          <img
                            src={existingLogoUrl}
                            alt="logo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all flex items-center justify-center rounded-xl">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur rounded-lg px-2 py-1 flex items-center gap-1">
                        <ZoomIn size={11} className="text-gray-700" />
                        <span className="text-[10px] font-bold text-gray-700">
                          Preview
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 p-3">
                    <QrCode size={28} className="text-gray-300" />
                    <span className="text-[10px] text-gray-400 text-center font-medium leading-tight">
                      Not generated
                    </span>
                  </div>
                )}
              </div>
              {hasQr && (
                <p className="text-[10px] text-gray-400 text-center leading-tight">
                  {formatDate(qrData.updated_at, "longTime")}
                </p>
              )}
            </div>

            {/* Right info */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Stats */}
              {hasQr && (
                <div className="flex flex-wrap gap-1.5">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700">
                    <ScanLine size={11} />
                    <span>Scans:</span>
                    <span className="font-black">{qrData.scan_count ?? 0}</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold ${qrData.is_active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    <Activity size={11} />
                    <span>{qrData.is_active ? "Active" : "Inactive"}</span>
                  </div>
                </div>
              )}

              {/* Scan URL */}
              {viewUrl ? (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                    Scan Target URL
                  </p>
                  <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                    <span className="text-[10px] text-gray-500 truncate flex-1 font-mono">
                      {viewUrl}
                    </span>
                    <button
                      onClick={handleCopy}
                      className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-lg transition-all ${copied ? "text-emerald-600 bg-emerald-50" : "text-gray-400 hover:bg-gray-200 hover:text-gray-600"}`}
                    >
                      {copied ? <Check size={11} /> : <Copy size={11} />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <p className="text-xs font-semibold text-gray-600 mb-0.5">
                    Ready to generate
                  </p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Optionally upload a logo below, then generate your QR code.
                  </p>
                </div>
              )}

              {/* Hint */}
              {hasQr && !existingLogoUrl && (
                <p className="text-[10px] text-gray-400 flex items-start gap-1.5">
                  <Info size={10} className="shrink-0 mt-0.5" />
                  Upload a logo &amp; regenerate to embed it in the QR centre.
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Logo Section */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
              Center Logo
              <span className="ml-1 normal-case tracking-normal font-medium text-gray-300">
                (optional)
              </span>
            </p>
            <LogoUploadZone
              menuType={menuType}
              outletId={outletId}
              existingLogoUrl={existingLogoUrl}
              onUploadSuccess={onRefresh}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto">
            {!hasQr ? (
              <button
                onClick={() => onRegenerate({ menuType })}
                disabled={isRegenerating}
                className={`flex-1 flex items-center justify-center gap-2 text-xs font-bold text-white py-3 rounded-xl transition-colors shadow-md disabled:opacity-60 ${colors.btn}`}
              >
                {isRegenerating ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <QrCode size={13} /> Generate QR Code
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold bg-emerald-600 text-white py-2.5 rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  <Download size={13} /> Download
                </button>
                <button
                  onClick={() => setShowPreview(true)}
                  title="Preview QR"
                  className="flex items-center justify-center px-3.5 py-2.5 rounded-xl text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border border-gray-200"
                >
                  <Eye size={14} />
                </button>
                <button
                  onClick={() => setShowRegenConfirm(true)}
                  disabled={isRegenerating}
                  title="Regenerate QR"
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors border border-amber-200 disabled:opacity-60"
                >
                  {isRegenerating ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <RefreshCw size={13} />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showPreview && (
        <QrPreviewModal
          qrUrl={qrData?.qrUrl}
          logoUrl={existingLogoUrl}
          title={`${meta.label} Menu QR`}
          viewUrl={viewUrl}
          onClose={() => setShowPreview(false)}
        />
      )}

      <ModalAction
        id="regenerate-qr"
        isOpen={showRegenConfirm}
        onClose={() => setShowRegenConfirm(false)}
        onConfirm={handleRegenerate}
        title="Regenerate QR Code"
        description={`This will generate a brand-new QR code for your ${
          MENU_TYPE_META[menuType]?.label || "menu"
        }. The existing QR code will stop working immediately.`}
        theme="danger"
        confirmText="Yes, Regenerate"
        cancelText="Cancel"
        loading={isRegenerating}
      />
    </>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const QrCodesPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((s) => s.auth);
  const { isFetchingQrCodes, qrCodes } = useSelector((s) => s.menuMedia);
  const [loadingType, setLoadingType] = useState(null);

  const qrMap = (qrCodes || []).reduce((acc, item) => {
    acc[item.menu_type] = item;
    return acc;
  }, {});

  const refresh = () => {
    if (outletId) dispatch(fetchAllQrCodes({ outletId }));
  };

  useEffect(() => {
    refresh();
  }, [outletId]);

  const handleRegenerate = async ({ menuType }) => {
    setLoadingType(menuType);
    await handleResponse(dispatch(regenerateQr({ outletId, menuType })), () =>
      refresh(),
    );
    setLoadingType(null);
  };

  if (isFetchingQrCodes) return <LoadingOverlay />;

  return (
    <div className="space-y-5">
      <PageHeader title="QR Codes" showBackButton />

      <InfoCard
        title={"How QR Codes work"}
        description={
          "Each menu type gets a unique QR code pointing to your live digital menu. Upload a logo to embed it in the centre, then regenerate the QR. When you regenerate, the old code stops working — replace any printed copies first."
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {Object.keys(MENU_TYPE_META).map((menuType) => (
          <QrCard
            key={menuType}
            menuType={menuType}
            outletId={outletId}
            qrData={qrMap[menuType] || null}
            onRegenerate={handleRegenerate}
            isRegenerating={loadingType === menuType}
            onRefresh={refresh}
          />
        ))}
      </div>
    </div>
  );
};

export default QrCodesPage;
