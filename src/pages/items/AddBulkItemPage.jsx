import React, { useState, useRef, useCallback, useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { handleResponse } from "../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadBulkUploadTemplate,
  previewBulkUploadFile,
  uploadBulkUploadFile,
  validateBulkUploadFile,
} from "../../redux/slices/bulkUploadSlice";
import { downloadBlob } from "../../utils/blob";
import TemplateSection from "../../partial/bulk-items/TemplateSection";
import UploadSection from "../../partial/bulk-items/UploadSection";
import ValidationSection from "../../partial/bulk-items/ValidationSection";
import PreviewSection from "../../partial/bulk-items/PreviewSection";
import SuccessSection from "../../partial/bulk-items/SuccessSection";
import StepIndicator from "../../partial/bulk-items/StepIndicator";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/paths";

// ─── Prevent accidental page leave ───────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
const AddBulkItemPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  usePreventNavigation(step > 1 && step < 5);

  const goToStep = (s) => {
    setStep(s);
    setMaxReached((prev) => Math.max(prev, s));
  };

  const downloadTemplate = async () => {
    await handleResponse(dispatch(downloadBulkUploadTemplate()), (res) => {
      downloadBlob({
        data: res.payload,
        fileName: "Item_Bulk_Upload_Template",
      });
    });
  };

  const handleFileSelected = async (selectedFile) => {
    const fd = new FormData();
    fd.append("file", selectedFile);
    fd.append("outletId", outletId);

    setFormData(fd);

    await handleResponse(dispatch(validateBulkUploadFile(fd)), async (res) => {
      goToStep(3);
      // if (res?.payload?.isValid) {
      //   await dispatch(previewBulkUploadFile(formData));
      // }
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
    await handleResponse(dispatch(uploadBulkUploadFile(formData)), () => {
      goToStep(5);
    });
  };

  const handleReset = () => {
    setStep(1);
    setMaxReached(1);
  };

  const actions = [
    {
      label: "View Summary",
      type: "primary",
      icon: Eye,
      onClick: () => navigate(ROUTE_PATHS.MENU_ITEMS_BULK_ADD_SUMMARY),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Bulk Upload Items" actions={actions} showBackButton />

      <div>
        <StepIndicator
          currentStep={step}
          maxReached={maxReached}
          onStepClick={setStep}
        />

        <div className="">
          {step === 1 && (
            <TemplateSection
              onDownload={downloadTemplate}
              onNext={() => goToStep(2)}
              loading={loadingTemplate}
            />
          )}
          {step === 2 && (
            <UploadSection
              onFileSelected={handleFileSelected}
              isValidating={isValidating}
            />
          )}
          {step === 3 && validationData && (
            <ValidationSection
              validationData={validationData}
              loading={isPreviewing}
              onNext={handlePreviewData}
              onReset={handleReset}
            />
          )}
          {step === 4 && previewData && (
            <PreviewSection
              previewData={previewData}
              onReset={handleReset}
              onUpload={handleUpload}
              isUploading={isUploading}
            />
          )}
          {step === 5 && (
            <SuccessSection uploadResult={uploadResult} onReset={handleReset} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBulkItemPage;
