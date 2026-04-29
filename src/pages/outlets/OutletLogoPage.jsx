import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOutletPrintLogo,
  updateOutletPrintLogo,
} from "../../redux/slices/outletSlice";
import DragDropUploader from "../../components/DragDropUploader";
import ToggleField from "../../components/fields/ToggleField";
import {
  Loader2, Save, ImageIcon, CheckCircle2,
  AlertCircle, Pencil, X, Upload,
} from "lucide-react";
import { handleResponse } from "../../utils/helpers";
import LoadingOverlay from "../../components/LoadingOverlay";

const OutletLogoPage = () => {
  const dispatch  = useDispatch();
  const { outletId } = useSelector((s) => s.auth);
  const {
    outletPrintLogo,
    isFetchingOutletPrintLogo,
    isUpdatingOutletPrintLogo,
  } = useSelector((s) => s.outlet);

  const [newLogo,  setNewLogo]  = useState([]);     // only populated when user picks a file
  const [enabled,  setEnabled]  = useState(false);
  const [isDirty,  setIsDirty]  = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // Sync state from API response
  useEffect(() => {
    if (outletPrintLogo) {
      setEnabled(outletPrintLogo.printLogoEnabled ?? false);
      setIsDirty(false);
      setNewLogo([]);
    }
  }, [outletPrintLogo]);

  useEffect(() => {
    if (outletId) dispatch(fetchOutletPrintLogo(outletId));
  }, [outletId]);

  const handleToggle = (val) => {
    setEnabled(val);
    setIsDirty(true);
  };

  const handleLogoChange = (files) => {
    setNewLogo(files);
    if (files.length > 0) setIsDirty(true);
  };

  const handleSave = async () => {
    const values = {
      printLogoEnabled: enabled,
      // ✅ Only send a new URL if user actually uploaded something
      ...(newLogo.length > 0 && { printLogoUrl: newLogo[0] }),
    };

    await handleResponse(
      dispatch(updateOutletPrintLogo({ outletId, values })),
      () => {
        setIsDirty(false);
        setNewLogo([]);
        setShowUpload(false);
        dispatch(fetchOutletPrintLogo(outletId));
      }
    );
  };

  const handleDiscard = () => {
    if (outletPrintLogo) setEnabled(outletPrintLogo.printLogoEnabled ?? false);
    setNewLogo([]);
    setIsDirty(false);
    setShowUpload(false);
  };

  // What to preview: new upload > existing saved URL
  const previewUrl   = newLogo.length > 0 ? newLogo[0] : outletPrintLogo?.printLogoUrl;
  const hasLogo      = !!previewUrl;
  const hasNewUpload = newLogo.length > 0;

  if (isFetchingOutletPrintLogo) return <LoadingOverlay />;

  return (
    <div className="space-y-5 pb-10">
      <PageHeader title="Receipt Logo" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">

        {/* ── LEFT: Preview ────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Logo preview card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>

            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
                <ImageIcon size={13} className="text-white" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-black text-slate-800 leading-none">
                  Logo Preview
                </p>
                {outletPrintLogo?.outletName && (
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">
                    {outletPrintLogo.outletName}
                  </p>
                )}
              </div>
            </div>

            {/* Preview area */}
            <div className="flex flex-col items-center justify-center px-6 py-8 min-h-[160px] bg-[repeating-linear-gradient(45deg,#f8fafc,#f8fafc_10px,#fff_10px,#fff_20px)]">
              {hasLogo ? (
                <div className="w-full max-w-[200px] bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-center"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <img
                    src={previewUrl}
                    alt="Receipt Logo"
                    className="h-[64px] w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center">
                    <ImageIcon size={20} className="text-slate-300" strokeWidth={1.5} />
                  </div>
                  <p className="text-[12px] font-bold text-slate-400">No logo uploaded</p>
                  <p className="text-[10px] text-slate-300 text-center">Upload one to display on receipts</p>
                </div>
              )}
            </div>

            {/* Status footer */}
            <div className={`flex items-center justify-between gap-2 px-5 py-3 border-t border-slate-100 ${enabled ? "bg-emerald-50" : "bg-slate-50"}`}>
              <div className="flex items-center gap-2">
                {enabled
                  ? <><CheckCircle2 size={13} className="text-emerald-600" strokeWidth={2.5} />
                      <p className="text-[11px] font-bold text-emerald-700">Visible on receipts</p></>
                  : <><AlertCircle size={13} className="text-slate-400" strokeWidth={2} />
                      <p className="text-[11px] font-bold text-slate-500">Not shown on receipts</p></>
                }
              </div>
              {hasNewUpload && (
                <span className="text-[9px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  New — unsaved
                </span>
              )}
            </div>
          </div>

          {/* Print guidelines */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div className="px-5 py-3.5 border-b border-slate-100">
              <p className="text-[12px] font-black text-slate-700">Print Guidelines</p>
            </div>
            <div className="px-5 py-3 space-y-2.5">
              {[
                { label: "Format",     value: "PNG with transparent bg" },
                { label: "Size",       value: "300 × 100 px"            },
                { label: "Max file",   value: "Under 100 KB"            },
                { label: "Best style", value: "Black & white"           },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400 font-medium">{label}</span>
                  <span className="text-[11px] font-bold text-slate-700">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Controls ──────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-4">

          {/* Visibility toggle */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={13} className="text-white" strokeWidth={2} />
              </div>
              <p className="text-[13px] font-black text-slate-800">Visibility</p>
            </div>
            <div className="px-5 py-4">
              <ToggleField
                label="Show logo on printed receipts"
                description="When enabled, your logo will appear at the top of every printed receipt."
                checked={enabled}
                onChange={handleToggle}
              />
            </div>
          </div>

          {/* Logo update section */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
                  <Upload size={13} className="text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[13px] font-black text-slate-800 leading-none">
                    {hasLogo ? "Update Logo" : "Upload Logo"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {hasLogo ? "Replace your current logo" : "Add a logo for your receipts"}
                  </p>
                </div>
              </div>
              {/* Toggle upload panel */}
              {!showUpload ? (
                <button
                  onClick={() => setShowUpload(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black text-white bg-primary-500 hover:bg-primary-600 transition-colors"
                >
                  <Pencil size={11} strokeWidth={2.5} />
                  {hasLogo ? "Change" : "Upload"}
                </button>
              ) : (
                <button
                  onClick={() => { setShowUpload(false); setNewLogo([]); if (!outletPrintLogo?.printLogoUrl) setIsDirty(false); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <X size={11} strokeWidth={2.5} />Cancel
                </button>
              )}
            </div>

            {/* Uploader — only shown when panel is open */}
            {showUpload && (
              <div className="p-5 border-b border-slate-100">
                <DragDropUploader
                  value={newLogo}
                  onChange={handleLogoChange}
                  multiple={false}
                  accept="image/png,image/jpeg"
                  maxFiles={1}
                  maxSize={100 * 1024}
                  enableCrop={true}
                  aspectRatio={3 / 2}
                  uploadToServer={true}
                />
                {hasNewUpload && (
                  <p className="text-[10px] text-slate-400 text-center mt-3 font-medium">
                    New logo selected — save to apply
                  </p>
                )}
              </div>
            )}

            {/* Current logo row — always shown if there's an existing logo */}
            {hasLogo && !showUpload && (
              <div className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img src={previewUrl} alt="current logo" className="h-8 w-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-slate-700">Current logo</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Click "Change" to replace it</p>
                </div>
                <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" strokeWidth={2.5} />
              </div>
            )}
          </div>

          {/* Save bar — floats into view when there are unsaved changes */}
          {isDirty && (
            <div className="flex items-center justify-between gap-3 px-5 py-4 bg-white rounded-2xl border border-primary-200"
              style={{ boxShadow: "0 2px 10px rgba(249,115,22,0.12)" }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse flex-shrink-0" />
                <p className="text-[12px] font-bold text-slate-700">You have unsaved changes</p>
              </div>
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <button
                  onClick={handleDiscard}
                  disabled={isUpdatingOutletPrintLogo}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-[12px] font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  disabled={isUpdatingOutletPrintLogo}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-black text-white transition-all hover:bg-primary-600 disabled:opacity-70"
                  style={{ background: "linear-gradient(135deg,#fb923c,#f97316)", boxShadow: "0 2px 8px rgba(249,115,22,0.3)" }}
                >
                  {isUpdatingOutletPrintLogo
                    ? <><Loader2 size={13} className="animate-spin" />Saving…</>
                    : <><Save size={13} strokeWidth={2.5} />Save Changes</>
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutletLogoPage;