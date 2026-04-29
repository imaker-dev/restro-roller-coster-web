import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  Wifi,
  WifiOff,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DropdownProfile from "./DropdownProfile";
import ModalAction from "../components/ModalAction";
import { clearLoginState } from "../redux/slices/authSlice";
import PermissionGuard from "../guard/PermissionGuard";
import { ROLES } from "../constants";
import OutletSwitcher from "./OutletSwitcher";
import ThemeToggle from "../components/ThemeToggle";

function Header({ sidebarOpen, setSidebarOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { connected, connecting } = useSelector((state) => state.socket);

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [showLogoutOverlay, setShowLogoutOverlay] = useState(false);

  const handleLogoutConfirm = async () => {
    dispatch(clearLoginState());
    setShowLogoutOverlay(false);
  };

  return (
    <>
      <header className="sticky top-0 bg-white border-b border-slate-200 z-30">
        <div className="px-4 sm:px-6 xl:px-8">
          <div className="flex items-center justify-between h-16 -mb-px">
            {/* Header: Left side */}
            <div className="flex">
              <button
                className="text-slate-500 hover:text-slate-600 xl:hidden"
                aria-controls="sidebar"
                aria-expanded={sidebarOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setSidebarOpen(!sidebarOpen);
                }}
              >
                <span className="sr-only">Open sidebar</span>
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Header: Right side */}
            <div className="flex items-center space-x-2">
              {/* Search */}
              {/* <button
                className={`w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full ml-3`}
                aria-controls="search-modal"
              >
                <span className="sr-only">Search</span>
                <Search className="w-4 h-4 text-slate-500" />
              </button> */}

              
              {/* <ThemeToggle /> */}

              {/* Notifications */}
              {/* <button
                onClick={() => navigate("/notifications")}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full ml-2"
              >
                <span className="sr-only">Notifications</span>
                <Bell className="w-4 h-4 text-slate-500" />
              </button> */}

              <OutletSwitcher />

              {/* Connectivity */}
              <PermissionGuard roles={[ROLES.KITCHEN, ROLES.BARTENDER]}>
                <div
                  title={
                    connecting
                      ? "Connecting to live updates..."
                      : connected
                        ? "Real-time updates active"
                        : "No live connection"
                  }
                  className={`w-8 h-8 flex items-center justify-center rounded-full ml-2 transition
                    ${
                      connecting
                        ? "bg-yellow-100 hover:bg-yellow-200"
                        : connected
                          ? "bg-green-100 hover:bg-green-200"
                          : "bg-red-100 hover:bg-red-200"
                    }`}
                >
                  {connecting ? (
                    <Loader2 className="w-4 h-4 text-yellow-700 animate-spin" />
                  ) : connected ? (
                    <Wifi className="w-4 h-4 text-green-700" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-700" />
                  )}
                </div>
              </PermissionGuard>

              {/* Divider */}
              <hr className="w-px h-6 bg-slate-200 border-none" />

              {/* Profile Dropdown */}
              <DropdownProfile
                align="right"
                onLogoutClick={() => setShowLogoutOverlay(true)}
              />
            </div>
          </div>
        </div>
      </header>

      <ModalAction
        id="logout-modal"
        variant="minimal"
        isOpen={showLogoutOverlay}
        onClose={() => setShowLogoutOverlay(false)}
        onConfirm={handleLogoutConfirm}
        title="Log out"
        description="Are you sure you want to log out of your account? You will need to sign in again to continue."
        theme="danger"
        confirmText="Log out"
        cancelText="Stay logged in"
      />
    </>
  );
}

export default Header;
