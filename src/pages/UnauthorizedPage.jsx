import React from "react";
import { ShieldOff, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../config/paths";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-5">
          <ShieldOff className="w-10 h-10 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          403 – Access Denied
        </h1>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-6">
          You don’t have permission to view this page.  
          If you believe this is a mistake, contact your administrator.
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
            border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <button
            onClick={() => navigate(ROUTE_PATHS.HOME)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
            rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
