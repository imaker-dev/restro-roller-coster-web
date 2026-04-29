import { AlertTriangle, Loader2, Lock, Trash2 } from "lucide-react";
import ModalBlank from "../../components/ModalBlank";
import useCountdown from "../../hooks/useCountdown";
import { useEffect, useState } from "react";

const OutletDeleteConfirmationModal = ({
  isOpen,
  onClose,
  outlet,
  totalRows,
  onConfirm,
  loading = false,
}) => {
  const requiredCode = outlet?.code || "";
  const [confirmationCode, setConfirmationCode] = useState("");

  const countdown = useCountdown(10, isOpen);
  const progress = ((10 - countdown) / 10) * 100;

const isCodeValid = confirmationCode.trim() === requiredCode.trim();

  const canConfirm = countdown === 0 && !loading && isCodeValid;

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm(confirmationCode);
  };

  useEffect(() => {
    if (!isOpen) {
      setConfirmationCode("");
    }
  }, [isOpen]);

  return (
    <ModalBlank
      id={"delete-outlet"}
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      {/* Modal */}
      <div>
        {/* Progress bar (countdown) */}
        <div className="h-0.5 w-full bg-slate-100">
          <div
            className="h-full bg-red-400 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-6">
          {/* Icon + title */}
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <Trash2 size={22} className="text-red-600" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-[17px] font-black text-slate-900 leading-tight mb-1">
                Permanently Delete Outlet?
              </h3>
              <p className="text-[12px] text-slate-500 leading-relaxed">
                You are about to delete{" "}
                <span className="font-bold text-slate-700">{outlet?.name}</span>
                . This action is{" "}
                <span className="font-bold text-red-600">irreversible</span>.
              </p>
            </div>
          </div>

          {/* Warning box */}
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3.5 mb-5 flex gap-3">
            <AlertTriangle
              size={16}
              className="text-red-500 flex-shrink-0 mt-0.5"
            />
            <div className="text-[12px] text-red-800 leading-relaxed">
              <span className="font-black block mb-0.5">
                {totalRows} rows will be deleted
              </span>
              This will permanently remove all outlet data across 19 database
              tables. There is no way to recover this data once deleted.
            </div>
          </div>

          {/* Confirmation Code Field */}
          <div className="mb-5">
            <label className="block text-[12px] font-bold text-slate-600 mb-1">
              Type <span className="text-red-600">{requiredCode}</span> to
              confirm
            </label>
            <input
              type="text"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              className="w-full form-input"
              placeholder="Enter confirmation code"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-700 font-bold text-[13px] py-2.5 rounded-xl hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className={`flex-1 flex items-center justify-center gap-2 font-bold text-[13px] py-2.5 rounded-xl
                ${
                  canConfirm
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-red-200 "
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : countdown > 0 ? (
                <>
                  <Lock size={13} /> Confirm ({countdown}s)
                </>
              ) : (
                <>
                  <Trash2 size={13} /> Confirm Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </ModalBlank>
  );
};

export default OutletDeleteConfirmationModal;
