import React, { useState, useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { handleResponse } from "../../utils/helpers";
import {
  downloadBulkUploadTemplate,
  previewBulkUploadFile,
  uploadBulkUploadFile,
  validateBulkUploadFile,
} from "../../redux/slices/bulkUploadSlice";
import { downloadBlob } from "../../utils/blob";
import UploadSection from "../../partial/bulk-items/UploadSection";
import ValidationSection from "../../partial/bulk-items/ValidationSection";
import PreviewSection from "../../partial/bulk-items/PreviewSection";
import SuccessSection from "../../partial/bulk-items/SuccessSection";
import StepIndicator from "../../partial/bulk-items/StepIndicator";
import {
  Download,
  FileSpreadsheet,
  Loader2,
  ArrowRight,
  Upload,
  Table,
  Info,
  Check,
  CheckCircle2,
} from "lucide-react";
import { addMasterMenu } from "../../redux/slices/itemSlice";

function usePreventNavigation(active) {
  useEffect(() => {
    if (!active) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [active]);
}

const AddMasterMenuPage = () => {
  const dispatch = useDispatch();

  const { outletId } = useSelector((state) => state.auth);
  const {
    loadingTemplate,
    isValidating,
    validationData,
    isPreviewing,
    previewData,
    isUploading,
    uploadResult,
  } = useSelector((state) => state.bulkUpload);

  const [formData, setFormData] = useState(null);
  const [step, setStep] = useState(1);
  const [maxReached, setMaxReached] = useState(1);

  usePreventNavigation(step > 1 && step < 4);

  const goToStep = (s) => {
    setStep(s);
    setMaxReached((prev) => Math.max(prev, s));
  };

  const downloadTemplate = async () => {
    await handleResponse(dispatch(downloadBulkUploadTemplate()), (res) => {
      downloadBlob({
        data: res.payload,
        fileName: "Master_Menu_Template",
      });
    });
  };

  const handleFileSelected = async (selectedFile) => {
    const fd = new FormData();
    fd.append("file", selectedFile);

    setFormData(fd);

    await handleResponse(dispatch(validateBulkUploadFile(fd)), () => {
      goToStep(3);
    });
  };

  const handlePreviewData = async () => {
    if (!formData) return;
    await handleResponse(dispatch(previewBulkUploadFile(formData)), () => {
      goToStep(4);
    });
  };

  const handleUpload = async () => {
    if (!formData) return;
    await handleResponse(dispatch(addMasterMenu({ values: formData })), () => {
      goToStep(5);
    });
  };

  const handleReset = () => {
    setStep(1);
    setMaxReached(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title={"Add Master Menu"} showBackButton />

      {/* Step Indicator */}
      <StepIndicator
        currentStep={step}
        maxReached={maxReached}
        onStepClick={setStep}
      />

      {/* Steps Content */}
      <div className="space-y-6">
        {/* Step 1: Template Download */}
        {step === 1 && (
          <div className="space-y-5">
            {/* Hero Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 p-6 sm:p-7 text-white shadow-xl">
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-20 w-40 h-40 rounded-full bg-black/10 translate-y-1/2" />

              <div className="relative z-10 flex flex-col sm:flex-row items-start justify-between gap-6">
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-100 mb-3">
                    <FileSpreadsheet size={10} />
                    Step 1 — Import Menu
                  </span>

                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
                    Upload Your Master Menu
                  </h2>

                  <p className="max-w-2xl text-[13px] leading-relaxed text-emerald-100 sm:text-sm">
                    Download the official CSV template to bulk upload your menu
                    items, categories, variants, add-ons, and pricing. Once
                    imported, your master menu can be reused across multiple
                    outlets and franchise locations for faster onboarding and
                    consistent menu management.
                  </p>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={downloadTemplate}
                      disabled={loadingTemplate}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-[13px] font-bold text-emerald-700 shadow-lg transition-all hover:bg-emerald-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loadingTemplate ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download size={14} strokeWidth={2.5} />
                          Download CSV Template
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => goToStep(2)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-[13px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95"
                    >
                      <Upload size={14} strokeWidth={2} />I Already Have a
                      Master Menu
                    </button>
                  </div>
                </div>

                {/* Right Icon */}
                <div className="hidden sm:flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                  <Table size={36} className="text-white/50" strokeWidth={1} />
                </div>
              </div>
            </div>

            {/* Template Info Card */}
            <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-emerald-50 px-5 py-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
                  <Info size={14} className="text-emerald-700" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">
                    CSV Template Includes
                  </p>
                  <p className="text-xs text-slate-500">
                    Everything required for a successful bulk menu upload
                  </p>
                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                  Ready to Use
                </span>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  "Categories & subcategories",
                  "Menu items & descriptions",
                  "Variants, add-ons & pricing",
                  "Sample data & formatting guide",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4"
                  >
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <Check size={12} className="text-emerald-700" />
                    </div>

                    <span className="text-xs font-medium leading-relaxed text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Upload */}
        {step === 2 && (
          <UploadSection
            onFileSelected={handleFileSelected}
            isValidating={isValidating}
          />
        )}

        {/* Step 3: Validation */}
        {step === 3 && validationData && (
          <ValidationSection
            validationData={validationData}
            loading={isPreviewing}
            onNext={handlePreviewData}
            onReset={handleReset}
          />
        )}

        {/* Step 4: Preview */}
        {step === 4 && previewData && (
          <PreviewSection
            previewData={previewData}
            onReset={handleReset}
            onUpload={handleUpload}
            isUploading={isUploading}
          />
        )}

        {/* Step 5: Success Popup */}
        {step === 5 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 ">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Success Content */}
              <div className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-10 text-center">
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-black/10 translate-y-1/2 -translate-x-1/3" />

                <div className="relative z-10 flex flex-col items-center">
                  {/* Success Icon */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                      <CheckCircle2
                        size={48}
                        className="text-white"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-black text-white tracking-tight mb-3">
                    Master Menu Saved Successfully!
                  </h2>

                  {/* Description */}
                  <p className="text-emerald-100 text-sm leading-relaxed max-w-sm">
                    Your master menu template has been uploaded and is now
                    available for all franchise locations to use.
                  </p>

                  {/* Done Button */}
                  <button
                    onClick={handleReset}
                    className="mt-8 inline-flex items-center gap-2 bg-white text-emerald-700 font-bold text-sm px-8 py-3 rounded-xl hover:bg-emerald-50 transition-all shadow-lg active:scale-95"
                  >
                    <CheckCircle2 size={18} strokeWidth={2.5} />
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMasterMenuPage;
