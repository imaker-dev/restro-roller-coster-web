import React from "react";
import { useSelector } from "react-redux";
import { Store, Info, ArrowRight, ShieldAlert, Mail, Plus } from "lucide-react";
import { ROLES } from "../../constants";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/paths";

const NoOutletsMessage = () => {
  const navigate = useNavigate();
  const { meData } = useSelector((state) => state.auth);

  const userRoleName = meData?.roles?.[0]?.slug || "User";
  const userName = meData?.name || "User";

  const isSuperAdmin = userRoleName === ROLES.SUPER_ADMIN;

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden">
          <div className="px-7 py-8 flex flex-col items-center text-center">
            {/* Icon */}
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center">
                <Store size={28} className="text-amber-500" />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm">
                <ShieldAlert size={13} className="text-slate-400" />
              </div>
            </div>

            {/* Text */}
            <h2 className="text-lg font-black text-slate-900 mb-2 leading-tight">
              No Outlets Assigned
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Hi <span className="font-bold text-slate-700">{userName}</span>,
              your{" "}
              <span className="font-bold text-slate-700">{userRoleName}</span>{" "}
              account doesn't have any outlets linked yet.
            </p>

            {/* Info box */}
            <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 mb-6 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white border border-slate-200 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Info size={12} className="text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Once an outlet is assigned, you'll have access to the
                  dashboard, orders, reports, and more.
                </p>
              </div>
            </div>

            {/* CTA */}
            {isSuperAdmin ? (
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
                <button
                  onClick={() => navigate(ROUTE_PATHS.OUTLET_ADD)}
                  className="btn w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-slate-900 hover:bg-orange-500 text-white text-sm font-bold transition-all duration-200 shadow-lg shadow-slate-900/10 hover:shadow-orange-500/20 active:scale-[0.98]"
                >
                  <Plus size={15} /> Create Outlet
                </button>
              </div>
            ) : (
              <a
                href="mailto:admin@yourcompany.com"
                className="btn inline-flex items-center gap-2.5 py-3.5 px-8 rounded-2xl bg-slate-900 hover:bg-orange-500 text-white text-sm font-bold transition-all duration-200 shadow-lg shadow-slate-900/10 active:scale-[0.98]"
              >
                <Mail size={15} /> Contact Administrator
              </a>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-slate-400 font-medium mt-4">
          Logged in as{" "}
          <span className="text-slate-600 font-bold">{userRoleName}</span>
        </p>
      </div>
    </div>
  );
};

export default NoOutletsMessage;
