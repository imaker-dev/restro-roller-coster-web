import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import Transition from "../utils/Transition";
import { useSelector } from "react-redux";
import PermissionGuard from "../guard/PermissionGuard";
import { ROLES } from "../constants";
import UserAvatar from "../components/UserAvatar";
import { ROUTE_PATHS } from "../config/paths";
import RoleBadge from "../partial/user/RoleBadge";
import { CreditCard, LogOut, Settings, User } from "lucide-react";

function DropdownProfile({ align, onLogoutClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { meData, loginSource } = useSelector((state) => state.auth);
  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        {/* Avatar Circle with Initial */}
        <UserAvatar name={meData?.name} size="sm" />

        <div className="flex items-center truncate">
          <span className="hidden md:block truncate ml-2 text-sm font-medium group-hover:text-slate-800">
            {meData?.name || "Admin Name"}
          </span>
          <svg
            className="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-44 bg-white  border border-slate-200  py-1.5 rounded shadow-lg overflow-hidden mt-1 ${
          align === "right" ? "right-0" : "left-0"
        }`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-slate-200 ">
            <div className="font-medium text-slate-800 ">
              {meData?.name || "Admin Name"}
            </div>
            <div className="text-xs text-slate-500  italic mb-1">
              {meData?.email || "No Email"}
            </div>
            <RoleBadge role={meData?.roles?.[0]?.slug} />
          </div>
          <ul>
            <li>
              <Link
                className="group flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition-all"
                to={ROUTE_PATHS.MY_PROFILE}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <User
                  size={16}
                  className="text-slate-400 group-hover:text-amber-600 transition-colors"
                />
                <span className="flex-1">My Profile</span>
              </Link>
            </li>
            <PermissionGuard roles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <li>
                <Link
                  className="group flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition-all"
                  to={ROUTE_PATHS.MY_SUBSCRIPTION}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <CreditCard
                    size={16}
                    className="text-slate-400 group-hover:text-amber-600 transition-colors"
                  />
                  <span className="flex-1">My Subscription</span>
                </Link>
              </li>
            </PermissionGuard>

            <PermissionGuard
              roles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER]}
            >
              <li>
                <Link
                  className="group flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition-all"
                  to={ROUTE_PATHS.ALL_SETTINGS}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <Settings
                    size={16}
                    className="text-slate-400 group-hover:text-amber-600 transition-colors"
                  />
                  <span className="flex-1">Settings</span>
                </Link>
              </li>
            </PermissionGuard>

            {loginSource != "mobile" && (
              <li>
                <button
                  className="group flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium text-red-500 hover:text-red-700 transition-all"
                  onClick={(e) => {
                    (e.stopPropagation(), onLogoutClick());
                  }}
                >
                  <LogOut
                    size={16}
                    className="text-red-500 group-hover:text-red-700 transition-colors"
                  />
                  <span className="flex-1">Sign Out</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownProfile;
