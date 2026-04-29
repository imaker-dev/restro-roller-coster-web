import { toast } from "react-toastify";

const VALID_TYPES = ["success", "error", "info", "warning", "default"];

export const showToast = ({
  title,
  message,
  type = "info",
  duration = 5000,
} = {}) => {
  // Safe type fallback
  const safeType = VALID_TYPES.includes(type) ? type : "info";

  // Fallback text
  const finalTitle = title || "Notification";
  const finalMessage = message || "";

  toast[safeType](
    <div>
      {finalTitle && (
        <p className="font-medium text-gray-900">{finalTitle}</p>
      )}

      {finalMessage && <p className="text-sm text-gray-500">{finalMessage}</p>}
    </div>,
    {
      autoClose: duration,
    },
  );
};
