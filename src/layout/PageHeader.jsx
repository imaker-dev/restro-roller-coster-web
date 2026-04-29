import React from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumb";
import PermissionGuard from "../guard/PermissionGuard";

const buttonVariants = {
  primary: "bg-primary-500 text-white hover:bg-primary-600",
  secondary: "bg-secondary-500 text-white hover:bg-secondary-600",
  danger: "bg-red-500 text-white hover:bg-red-600",
  info: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  export:
    "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
  refresh: "border border-gray-200 bg-white hover:bg-gray-50",
};

const PageHeader = ({
  title,
  description,
  showBackButton = false,
  backLabel = "Back",
  onlyBack = false, // ✅ NEW PROP
  actions = [],
  badge = null,
  rightContent = null,
}) => {
  const navigate = useNavigate();

  // ✅ If onlyBack is true → render ONLY back button
  if (onlyBack) {
    return (
      <div className="w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[12px] font-semibold text-slate-500 hover:text-slate-800 transition-colors group"
          type="button"
        >
          <span className="w-7 h-7 rounded-lg border border-slate-200 bg-white shadow-sm flex items-center justify-center group-hover:border-slate-300 transition-colors">
            <ArrowLeft size={13} className="text-slate-500" strokeWidth={2.5} />
          </span>
          {backLabel}
        </button>
      </div>
    );
  }

  return (
    <header className="flex flex-col gap-4 sm:gap-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 lg:gap-4 w-full">
        {/* Title Section */}
        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="flex-shrink-0 p-2 sm:p-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
            </button>
          )}

          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
              {title}
            </h1>

            {description ? (
              <p className="text-gray-600 mt-1 text-sm sm:text-base line-clamp-2">
                {description}
              </p>
            ) : (
              <div className="mt-1">
                <Breadcrumbs />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {rightContent}

          {badge && (
            <div className="flex items-center gap-2 flex-wrap">
              {Array.isArray(badge)
                ? badge.map((b, i) => <div key={i}>{b}</div>)
                : badge}
            </div>
          )}

          {actions.length > 0 && (
            <div className="flex items-center gap-2 sm:gap-3">
              {actions.map((action, index) => {
                const variantClass =
                  buttonVariants[action.type] || buttonVariants.secondary;

                const ActionIcon = action.icon;
                const isDisabled = action.loading || action.disabled;

                const content = (
                  <>
                    {action.loading ? (
                      <Loader2 className="h-4 w-4 lg:mr-2 animate-spin" />
                    ) : (
                      ActionIcon && <ActionIcon className="h-4 w-4 lg:mr-2" />
                    )}
                    <span className="hidden lg:inline whitespace-nowrap">
                      {action.loading
                        ? action.loadingText || action.label
                        : action.label}
                    </span>
                  </>
                );

                const buttonElement = action.href ? (
                  <a
                    key={index}
                    href={action.href}
                    target={action.target || "_blank"}
                    rel="noopener noreferrer"
                    className={`btn lg:btn-lg ${variantClass} flex items-center ${
                      isDisabled ? "pointer-events-none opacity-70" : ""
                    }`}
                  >
                    {content}
                  </a>
                ) : (
                  <button
                    key={index}
                    type="button"
                    title={
                      isDisabled
                        ? action.disabledTitle || "Action unavailable"
                        : ""
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick && action.onClick(e);
                    }}
                    disabled={isDisabled}
                    className={`btn lg:btn-lg ${variantClass} flex items-center ${
                      isDisabled ? "opacity-70 !cursor-not-allowed" : ""
                    }`}
                  >
                    {content}
                  </button>
                );

                if (action.roles || action.permissions) {
                  return (
                    <PermissionGuard
                      key={index}
                      roles={action.roles}
                      permissions={action.permissions}
                    >
                      {buttonElement}
                    </PermissionGuard>
                  );
                }

                return buttonElement;
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
