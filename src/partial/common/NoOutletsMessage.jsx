import React from "react";
import { useSelector } from "react-redux";
import { Store, Info, ArrowRight, Mail, Plus, Zap } from "lucide-react";
import { ROLES } from "../../constants";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/paths";
import { formatText } from "../../utils/utils";

const NoOutletsMessage = () => {
  const navigate = useNavigate();
  const { meData } = useSelector((state) => state.auth);

  const userRoleName = meData?.roles?.[0]?.slug || "User";
  const userName = meData?.name || "User";

  const isSuperAdmin = userRoleName === ROLES.SUPER_ADMIN;

  return (
    <div className="flex items-center justify-center ">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="relative bg-white rounded-2xl border border-slate-200 shadow overflow-hidden">
          <div className="px-8 py-10 flex flex-col items-center text-center">
            {/* Icon */}
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center ring-1 ring-primary-200">
                <Store size={28} className="text-primary-500" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm">
                <Zap size={12} className="text-yellow-500 fill-yellow-500" />
              </div>
            </div>

            {/* Text */}
            <h2 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">
              {isSuperAdmin ? "Your account is ready" : "No outlets assigned"}
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-xs">
              {isSuperAdmin
                ? "Start creating outlets to manage your restaurant operations and unlock the full potential of your dashboard."
                : `Hi ${userName}, your ${userRoleName} account doesn't have any outlets linked yet.`}
            </p>

            {/* Info box */}
            <div className="w-full bg-primary-100 border border-primary-200 rounded-xl px-4 py-3.5 mb-6 text-left">
              <div className="flex items-start gap-2.5">
                <Info size={14} className="text-primary-500 mt-0.5 shrink-0" />
                <p className="text-xs text-primary-700 leading-relaxed">
                  Once an outlet is assigned, you'll have access to the
                  dashboard, orders, reports, and more.
                </p>
              </div>
            </div>

            {/* CTA */}
            {isSuperAdmin ? (
              <button
                onClick={() => navigate(ROUTE_PATHS.OUTLET_ADD)}
                className="group btn w-full inline-flex items-center justify-center gap-2.5 bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600"
              >
                <Plus size={16} />
                Create Your First Outlet
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </button>
            ) : (
              <a
                href="mailto:admin@yourcompany.com"
                className="group btn w-full inline-flex items-center justify-center gap-2.5  bg-white border-2 border-primary-200 text-primary-700 hover:border-primary-300 hover:bg-primary-100"
              >
                <Mail size={16} />
                Contact Administrator
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </a>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 bg-slate-50 px-8 py-3">
            <p className="text-center text-xs text-slate-400">
              Logged in as{" "}
              <span className="text-slate-500 font-semibold capitalize">
                {formatText(userRoleName)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoOutletsMessage;
