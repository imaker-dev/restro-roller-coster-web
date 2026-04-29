import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sideabar";
import Header from "./Header";
// import { useSelector } from "react-redux"; // optional if you want role-based control

function AppLayout({ children }) {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* ---------------- LAYOUT RULES ----------------
     You can control per route what to show
  */
  const layoutRules = {
    "/order-display": {
      sidebar: false,
      header: false,
    },
    "/support": {
      sidebar: true,
      header: false,
      padding: false,
    },
    "/guide": {
      sidebar: false,
      header: false,
      padding: false,
    },
    "/unauthorized": {
      sidebar: false,
      header: false,
    },
  };

  const defaultLayout = {
    sidebar: true,
    header: true,
    padding: true,
  };

  const currentLayout = layoutRules[location.pathname] || defaultLayout;

  let showSidebar = currentLayout.sidebar;
  let showHeader = currentLayout.header;
  let showPadding = currentLayout.padding ?? true;

  /* -------- OPTIONAL USER ROLE CONTROL --------
  const { user } = useSelector((state) => state.auth);
  if (user?.role === "staff") {
    showSidebar = false;
  }
  */

  /* ---------------- MOBILE CHECK ---------------- */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ---------------- SIDEBAR EXPANDED STATE ---------------- */
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sidebar-expanded");
      return stored !== null ? stored === "true" : true;
    }
    return true;
  });

  /* ---------------- BODY CLASS + LOCAL STORAGE ---------------- */
  useEffect(() => {
    if (!isMobile && showSidebar) {
      localStorage.setItem("sidebar-expanded", sidebarExpanded);
    }

    const effectiveExpanded = isMobile ? true : sidebarExpanded;

    if (effectiveExpanded && showSidebar) {
      document.body.classList.add("sidebar-expanded");
    } else {
      document.body.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded, isMobile, showSidebar]);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* -------- SIDEBAR -------- */}
      {showSidebar && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
        />
      )}

      {/* -------- CONTENT AREA -------- */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* -------- HEADER -------- */}
        {showHeader && (
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}

        {/* -------- MAIN -------- */}
        <main className="grow bg-gray-100">
          <div
            className={`w-full container max-w-10xl mx-auto ${
              showPadding ? "p-4 sm:p-6" : ""
            }`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
