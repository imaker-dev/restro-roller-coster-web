import React from "react";
import { X, ShieldCheck, ShieldOff, Loader2 } from "lucide-react";
import UserAvatar from "../../components/UserAvatar";
import ModalBlank from "../../components/ModalBlank";

const ConfirmationOverlay = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  admin,
  type, // 'activate' | 'deactivate'
}) => {

  const isActivate = type === "activate";

  return (
    <ModalBlank id={'super-admin-status'} isOpen={isOpen} onClose={onClose} size="md">

      {/* Modal */}
      <div className="relative bg-white ">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isActivate ? "bg-emerald-100" : "bg-red-100"
              }`}
            >
              {isActivate ? (
                <ShieldCheck size={20} className="text-emerald-600" />
              ) : (
                <ShieldOff size={20} className="text-red-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">
                {isActivate ? "Activate Super Admin" : "Deactivate Super Admin"}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isActivate
                  ? "This will allow access to the system"
                  : "This will revoke access to the system"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X size={14} className="text-slate-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            {isActivate
              ? "Are you sure you want to activate this super admin? They will be able to log in and access the system."
              : "Are you sure you want to deactivate this super admin? They will no longer be able to log in or access the system."}
          </p>

          {/* Admin Details */}
          {admin && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={admin.name}
                  src={admin.avatarUrl}
                  className="sm"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {admin.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {admin.email}
                  </p>
                  {admin.employeeCode && (
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {admin.employeeCode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-50  disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className={`btn text-white  flex items-center gap-2 disabled:opacity-50 ${
              isActivate
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {isActivate ? "Activating..." : "Deactivating..."}
              </>
            ) : isActivate ? (
              "Activate"
            ) : (
              "Deactivate"
            )}
          </button>
        </div>
      </div>
    </ModalBlank>
  );
};

export default ConfirmationOverlay;
