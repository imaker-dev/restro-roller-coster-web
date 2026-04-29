import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../config/paths";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80dvh] flex items-center justify-center px-4">
      <div className="text-center max-w-xl w-full">
        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <img
            src="/Images/404.png"   // put your illustration here
            alt="404 Error"
            className="w-full max-w-xs h-auto object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
          Oops, something went wrong
        </h1>

        {/* Description */}
        <p className="text-gray-500 text-sm sm:text-base mb-6 leading-relaxed">
          Error 404 Page not found. Sorry the page you looking for
          doesn’t exist or has been moved
        </p>

        {/* Button */}
        <button
          onClick={() => navigate(ROUTE_PATHS.HOME)}
          className="bg-orange-500 hover:bg-orange-600 text-white
                     text-sm font-medium px-5 py-2 rounded-md
                     transition shadow-sm hover:shadow-md"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
