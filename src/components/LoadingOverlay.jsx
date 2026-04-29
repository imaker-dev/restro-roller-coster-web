import { RefreshCw } from "lucide-react";

export default function LoadingOverlay({
  // show = false,
  text = "Loading...",
}) {
  // if (!show) return null;

  return (
    <div className="flex items-center justify-center h-[80dvh]">
      <div className="text-center">
        <RefreshCw className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  );
}
