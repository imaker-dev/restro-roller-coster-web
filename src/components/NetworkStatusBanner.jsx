import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";

export default function NetworkStatusBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showBanner = () => {
      setVisible(true);
    };

    const hideBanner = () => {
      setTimeout(() => setVisible(false), 3000); // Hide after 3 seconds
    };

    const handleOnline = () => {
      setIsOnline(true);
      showBanner();
      hideBanner();
    };

    const handleOffline = () => {
      setIsOnline(false);
      showBanner(); // Don't auto-hide when offline
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out transform ${
        visible ? "translate-y-0" : "-translate-y-full"
      } ${isOnline ? "bg-green-600" : "bg-red-600"} text-white`}
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium">
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4 text-white" />
            <span>You're back online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-white" />
            <span>You're offline. Check your connection</span>
          </>
        )}
      </div>
    </div>
  );
}
