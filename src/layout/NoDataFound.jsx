import React from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";

const NoDataFound = ({
  title = "No data available",
  description = "There is nothing to display at the moment.",
  icon: Icon = Package,
  className = "",
  showBackButton = false,
  size = "md", // 👈 sm | md | lg
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => navigate(-1);

  // ✅ Size variants
  const sizeStyles = {
    xs: {
      container: "py-6",
      icon: "w-6 h-6 mb-2",
      title: "text-sm",
      desc: "text-xs",
    },
    sm: {
      container: "py-10",
      icon: "w-8 h-8 mb-3",
      title: "text-base",
      desc: "text-xs",
    },
    md: {
      container: "py-16",
      icon: "w-12 h-12 mb-4",
      title: "text-lg md:text-xl",
      desc: "text-sm md:text-base",
    },
    lg: {
      container: "py-24",
      icon: "w-16 h-16 mb-5",
      title: "text-xl md:text-2xl",
      desc: "text-base md:text-lg",
    },
  };

  const styles = sizeStyles[size] || sizeStyles.md;

  return (
    <div
      className={`${styles.container} flex flex-col items-center justify-center text-center px-4 ${className}`}
    >
      {/* Icon */}
      {Icon && <Icon className={`${styles.icon} text-gray-300`} />}

      {/* Title */}
      <h2 className={`${styles.title} font-semibold text-gray-900 mb-2`}>
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className={`${styles.desc} text-gray-500 mb-4`}>{description}</p>
      )}

      {/* Back Button */}
      {showBackButton && (
        <button
          onClick={handleGoBack}
          className="btn bg-secondary text-white hover:bg-secondary-600"
        >
          Go Back
        </button>
      )}
    </div>
  );
};

export default NoDataFound;
