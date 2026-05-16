import { Wifi, WifiOff } from "lucide-react";
import { formatDate } from "../../utils/dateFormatter";
import StatusBadge from "../../layout/StatusBadge";
import ModalBlank from "../../components/ModalBlank";

// Add this modal component for printer test results
const PrinterTestResultModal = ({
  isOpen,
  onClose,
  printerData,
  printerName,
}) => {
  return (
    <ModalBlank
      id={"printer-result"}
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
    >
      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-4">
          {printerData?.isOnline ? (
            <div className="p-2 bg-emerald-100 rounded-full">
              <Wifi className="w-6 h-6 text-emerald-600" />
            </div>
          ) : (
            <div className="p-2 bg-red-100 rounded-full">
              <WifiOff className="w-6 h-6 text-red-600" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              {printerName}
            </h3>
            <StatusBadge
              value={printerData?.isOnline}
              trueText="Online"
              falseText="Offline"
            />
          </div>
        </div>

        <div className="space-y-3 bg-slate-50 rounded-lg p-4">
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">IP Address</span>
            <span className="text-sm font-medium text-slate-700 font-mono">
              {printerData?.ipAddress}:{printerData?.port}
            </span>
          </div>

          {printerData?.latency && (
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Latency</span>
              <span
                className={`text-sm font-medium ${
                  printerData?.isOnline ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {printerData?.latency}
              </span>
            </div>
          )}

          {!printerData?.isOnline && printerData?.message && (
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Error</span>
              <span className="text-sm font-medium text-red-600">
                {printerData?.message}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Last Checked</span>
            <span className="text-sm font-medium text-slate-700">
              {formatDate(printerData?.checkedAt, "longTime")}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
        >
          Close
        </button>
      </div>
    </ModalBlank>
  );
};
export default PrinterTestResultModal;
