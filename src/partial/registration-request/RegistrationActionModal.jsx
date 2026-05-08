import React from "react";
import ModalBasic from "../../components/ModalBasic";
import { CheckCircle, XCircle, Edit2, Loader2 } from "lucide-react";
import PlanBadge from "./PlanBadge";

const RegistrationActionModal = ({
  actionState,
  setActionState,
  onConfirm,
  loading,
}) => {
  const { open, type, row, notes } = actionState;

  const closeModal = () =>
    setActionState({ open: false, type: null, row: null, notes: "" });

  return (
    <ModalBasic
      id="registration-action-modal"
      isOpen={open}
      onClose={() => closeModal}
      title={
        <div className="flex items-center gap-2">
          <div
            className={`h-8 w-8 rounded-lg flex items-center justify-center ${
              type === "approved"
                ? "bg-gradient-to-br from-green-500 to-emerald-600"
                : "bg-gradient-to-br from-red-500 to-rose-600"
            }`}
          >
            {type === "approved" ? (
              <CheckCircle className="h-5 w-5 text-white" />
            ) : (
              <XCircle className="h-5 w-5 text-white" />
            )}
          </div>
          <span>
            {type === "approved"
              ? "Approve Registration Request"
              : "Reject Registration Request"}
          </span>
        </div>
      }
    >
      <div className="px-6 py-5">
        {/* Restaurant Summary Card */}
        {row && (
          <div className="mb-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800 text-base">
                {row.restaurant_name}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <span>{row.city}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>{row.state}</span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="text-slate-400">Contact:</span>
                  <span className="font-medium text-slate-700">
                    {row.contact_person}
                  </span>
                </span>

                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="text-slate-400">Plan:</span>
                  <PlanBadge plan={row.plan_interest} />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Confirmation Banner */}
        <div
          className={`relative overflow-hidden rounded-xl border-2 p-4 mb-5 ${
            type === "approved"
              ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
              : "border-red-200 bg-gradient-to-r from-red-50 to-rose-50"
          }`}
        >
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-current"></div>
            <div className="absolute -left-4 -bottom-4 h-16 w-16 rounded-full bg-current"></div>
          </div>

          <div className="flex-1">
            <h5 className="font-semibold text-slate-800 mb-1">
              {type === "approved"
                ? "Ready to approve this registration?"
                : "Are you sure you want to reject this request?"}
            </h5>
            <p className="text-sm text-slate-600">
              {type === "approved"
                ? "This will grant the restaurant access to the platform. They'll receive an email notification with login instructions."
                : "This action is permanent and cannot be undone. The restaurant will be notified of this decision."}
            </p>
          </div>
        </div>

        {/* Notes Field */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
              {type === "approved" ? (
                <>
                  <Edit2 className="h-3.5 w-3.5 text-slate-400" />
                  Approval Notes
                </>
              ) : (
                <>
                  <Edit2 className="h-3.5 w-3.5 text-slate-400" />
                  Rejection Reason
                </>
              )}
              <span className="text-xs font-normal text-slate-400">
                (Optional)
              </span>
            </label>
            {notes && (
              <span className="text-xs text-slate-400">
                {notes.length} characters
              </span>
            )}
          </div>

          <textarea
            className={`w-full px-4 py-3 rounded-xl border text-sm placeholder:text-slate-400 transition-all duration-200 resize-none
          focus:outline-none focus:ring-2 focus:border-transparent
          ${
            type === "approved"
              ? "focus:ring-green-500/20 border-slate-200 bg-white hover:border-green-300"
              : "focus:ring-red-500/20 border-slate-200 bg-white hover:border-red-300"
          }
        `}
            rows={2}
            placeholder={
              type === "approved"
                ? "Add any internal notes about this approval...\n(These won't be shared with the restaurant)"
                : "Please provide a reason for rejection...\n(This will be shared with the restaurant)"
            }
            value={notes}
            onChange={(e) =>
              setActionState((prev) => ({
                ...prev,
                notes: e.target.value,
              }))
            }
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() =>
              setActionState({
                open: false,
                type: null,
                row: null,
                notes: "",
              })
            }
            disabled={loading}
            className="btn border border-slate-200 text-slate-600 
          hover:bg-slate-50 hover:border-slate-300
          disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`btn flex gap-1.5 text-white
          ${
            type === "approved"
              ? "bg-emerald-500 hover:bg-emerald-600"
              : "bg-red-500 hover:bg-red-600"
          }
        `}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                {type === "approved" ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Confirm Approval</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    <span>Confirm Rejection</span>
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </ModalBasic>
  );
};

export default RegistrationActionModal;
