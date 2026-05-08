// Breadcrumb.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { ROUTE_PATHS } from "../config/paths";
import { formatText } from "../utils/utils";

const Breadcrumb = () => {
  const location = useLocation();

  const paths = location.pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center flex-wrap text-sm text-gray-500 gap-1">
      {/* Dashboard */}
      <Link
        to={ROUTE_PATHS.HOME}
        className="flex items-center hover:text-primary-600 transition-colors"
      >
        {paths.length > 0 ? (
          <Home size={16} />
        ) : (
          <span className="font-medium">Dashboard</span>
        )}
      </Link>

      {paths.map((segment, index) => {
        const routeTo = "/" + paths.slice(0, index + 1).join("/");
        const isLast = index === paths.length - 1;

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />

            {isLast ? (
              <span className="font-semibold text-gray-800 truncate max-w-[160px]">
                {formatText(segment)}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-primary-600 transition-colors truncate max-w-[140px]"
              >
                {formatText(segment)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
