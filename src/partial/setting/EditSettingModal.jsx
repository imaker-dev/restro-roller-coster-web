import { useEffect, useState } from "react";
import ModalBasic from "../../components/ModalBasic";
import { InputField } from "../../components/fields/InputField";
import { Info, Loader2, Percent } from "lucide-react";

export const EditSettingModal = ({
  isOpen,
  setting,
  onClose,
  onSave,
  loading = false,
}) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (setting) {
      setValue(setting.value ?? "");
    }
  }, [setting]);

  const handleSave = () => {
    if (!setting) return;

    const finalValue = setting.type === "number" ? parseFloat(value) : value;

    onSave(setting.key, finalValue); // ✅ pass key + value
  };

  const isPercentageField =
    setting?.key?.toLowerCase().includes("rate") ||
    setting?.key?.toLowerCase().includes("percent");

  return (
    <ModalBasic
      id={"update-settings"}
      title={` Edit ${setting?.key.replaceAll("_", " ")}`}
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      <div className="bg-white space-y-5">
        {/* Content */}
        <div className="p-5 space-y-5">
          <InputField
            label={setting?.description}
            type={setting?.type === "number" ? "number" : "text"}
            name="description"
            placeholder={`Enter ${setting?.key.replaceAll("_", " ")}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
            icon={isPercentageField ? Percent : undefined}
          />

          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-2">
              <Info size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed">
                {setting?.isDefault
                  ? "This is a default value used across the system."
                  : "Custom value for this setting."}
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
            onClick={handleSave}
            disabled={loading}
            className="btn bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </ModalBasic>
  );
};
