import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ROLES } from "../../constants";

export default function WelcomeBanner() {
  const { meData } = useSelector((state) => state.auth);
  const role = meData?.roles?.[0]?.slug ?? "guest";

  const [dateTime, setDateTime] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const dateOptions = {
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      const formattedDate = now.toLocaleDateString("en-US", dateOptions);

      const timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      const formattedTime = now.toLocaleTimeString("en-US", timeOptions);

      setDateTime(formattedDate);
      setTime(formattedTime);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getWelcomeMessage = (role) => {
    switch (role) {
      case ROLES.SUPER_ADMIN:
        return "Full system control is in your hands ⚙️";
      case ROLES.ADMIN:
        return "Manage your business efficiently 📊";
      case ROLES.KITCHEN:
        return "Orders are waiting — let’s cook! 🔥";
      case ROLES.BARTENDER:
        return "Drinks lineup ready to serve 🍹";
      default:
        return "Welcome! Have a productive day ✨";
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded">
      {/* Clean orange gradient background */}
      <div className="absolute inset-0 bg-primary-500"></div>

      {/* Subtle decorative element at bottom right */}
      <div className="absolute bottom-0 right-0 w-40 h-40 opacity-20">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="150" cy="150" r="100" fill="white" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Left section - Text */}
          <div>
            <h1 className="text-lg lg:text-2xl font-bold text-white mb-1">
              Welcome Back, {meData?.name}
            </h1>
            <p className="text-sm sm:text-base text-white">
              {getWelcomeMessage(role)}
            </p>
          </div>

          {/* Right section - Date and Time */}
          <div className="flex gap-3 sm:gap-4">
            {/* Date button */}
            <button className="bg-gray-900 text-white px-4 sm:px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-gray-800 transition-colors">
              {dateTime || "Loading..."}
            </button>

            {/* Time button */}
            <button className="bg-white text-gray-900 px-4 sm:px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-gray-100 transition-colors">
              {time || "Loading..."}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
