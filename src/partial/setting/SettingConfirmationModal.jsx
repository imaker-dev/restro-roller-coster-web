import { AlertCircle, Loader2 } from "lucide-react";
import ModalBasic from "../../components/ModalBasic";
import { useSelector } from "react-redux";

export const SettingConfirmationModal = ({
  isOpen,
  setting,
  onClose,
  onConfirm,
  loading=false,
}) => {

  const handleConfirm = () => {
    if (!setting) return;

    const newValue = !setting.value;

    onConfirm(setting.key, newValue);
  };
  return (
    <ModalBasic
      id={"update-setting-conformation"}
      title={"Confirm Action"}
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      <div className="bg-white ">
        {/* Content */}
        <div className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                setting?.value ? "bg-amber-100" : "bg-emerald-100"
              }`}
            >
              <AlertCircle
                size={20}
                className={
                  setting?.value ? "text-amber-600" : "text-emerald-600"
                }
              />
            </div>
            <div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Are you sure you want to{" "}
                <strong
                  className={
                    setting?.value ? "text-amber-700" : "text-emerald-700"
                  }
                >
                  {setting?.value ? "disable" : "enable"}
                </strong>{" "}
                <strong className="text-gray-900">
                  {setting?.key.replaceAll("_", " ")}
                </strong>
                ?
              </p>
              <p className="text-xs text-gray-500 mt-2">
                This change will take effect immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="btn border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="btn bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </ModalBasic>
  );
};
