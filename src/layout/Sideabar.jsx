import React, { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

import SidebarLinkGroup from "./SidebarLinkGroup";
import { navConfig } from "../config/nav-config";
import { ChevronDown, ChevronRight, ChevronsLeft } from "lucide-react";
import { hasAccess } from "../utils/accessControl";
import { useSelector } from "react-redux";
import Tooltip from "../components/Tooltip";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  sidebarExpanded,
  setSidebarExpanded,
}) {
  const { meData } = useSelector((state) => state.auth);

  const userId = meData?.id;

  const userRole = meData?.roles[0]?.slug;
  const userPermissions = meData?.permissions || [];

  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const effectiveExpanded = isMobile ? true : sidebarExpanded;

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  // Helper function to determine if an item is active
  const isItemActive = (item) => {
    if (item.path) {
      return pathname === item.path || pathname.startsWith(`${item.path}/`);
    } else if (item.children) {
      return item.children.some(
        (child) =>
          pathname === child.path || pathname.startsWith(`${child.path}/`),
      );
    }
    return false;
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const filteredNavConfig = navConfig
    .map((group) => {
      const filteredItems = group.items
        .map((item) => {
          // CHILDREN CASE
          if (item.children) {
            const parentAllowed = hasAccess({
              userRole,
              userPermissions,

              userId,
              path: item.path,

              roles: item.roles,
              permissions: item.permissions,
              public: item.public, // ADD THIS
            });

            if (!parentAllowed) return null;

            const children = item.children.filter((child) =>
              hasAccess({
                userRole,
                userPermissions,

                userId,
                path: child.path,

                roles: child.roles,
                permissions: child.permissions,
                public: child.public, // ADD THIS
              }),
            );

            return children.length ? { ...item, children } : null;
          }

          // NORMAL ITEM
          return hasAccess({
            userRole,
            userPermissions,
            
            userId,
            path: item.path,

            roles: item.roles,
            permissions: item.permissions,
            public: item.public, // ADD THIS
          })
            ? item
            : null;
        })
        .filter(Boolean);

      return filteredItems.length ? { ...group, items: filteredItems } : null;
    })
    .filter(Boolean);

  return (
    <div className="min-w-fit relative">
      <div className="hidden xl:block absolute -right-3 top-6 z-40">
        <Tooltip
          content={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          position="right"
        >
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="p-1 group relative flex items-center justify-center rounded-full bg-white border border-gray-200 shadow hover:shadow-lg hover:bg-gray-50 transition-all duration-200"
          >
            <span className="sr-only">Toggle sidebar</span>

            <ChevronsLeft
              className={`
          w-3.5 h-3.5 text-gray-600
          transition-transform duration-300 ease-in-out
          ${!sidebarExpanded ? "rotate-180" : ""}
        `}
            />
          </button>
        </Tooltip>
      </div>

      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 xl:hidden xl:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 xl:static xl:left-auto xl:top-auto xl:translate-x-0 h-[100dvh] overflow-hidden shrink-0 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } ${effectiveExpanded ? "w-64" : "xl:w-20"}`}
      >
        {/* Sidebar header */}
        <div className="bg-white px-4 border-b border-gray-200 sticky top-0 z-10 h-16">
          {/* Logo */}
          <NavLink
            end
            to="/"
            className={`flex items-center ${effectiveExpanded ? "justify-start" : "justify-center"} h-16`}
          >
            {effectiveExpanded && (
              <img src="/Images/Logo.svg" alt="" className="w-40" />
            )}
            {!effectiveExpanded && (
              <img src="/Images/logo-icon.png" className="w-8" />
            )}
          </NavLink>
        </div>

        {/* Links */}
        <div
          className={`space-y-6 p-4 flex-1 overflow-y-auto no-scrollbar ${
            effectiveExpanded ? "" : "space-y-4"
          }`}
        >
          {filteredNavConfig.map((group) => (
            <div key={group.title}>
              {/* Group title */}
              <h3
                className={`text-[10px] font-semibold uppercase text-gray-500 mb-2 transition-all duration-200 ${
                  effectiveExpanded
                    ? "opacity-100"
                    : "text-center opacity-60 px-0"
                }`}
              >
                {effectiveExpanded ? (
                  group.title
                ) : (
                  <span className="block w-full text-center">•••</span>
                )}
              </h3>

              <ul
                className={`${effectiveExpanded ? "space-y-1" : "space-y-2"}`}
              >
                {group.items.map((item) => {
                  const isActive = isItemActive(item);
                  const iconClass = isActive
                    ? "text-primary-500"
                    : "text-gray-500";

                  if (item.children) {
                    return (
                      <SidebarLinkGroup
                        key={item.name}
                        activecondition={isActive}
                        sidebarExpanded={effectiveExpanded}
                        itemName={item.name}
                      >
                        {(handleClick, open) => (
                          <div className="bg-red-100group relative">
                            <Tooltip
                              content={item.name}
                              position="right"
                              disabled={effectiveExpanded || isMobile}
                            >
                              <a
                                href="#0"
                                className={`block truncate transition-all duration-200 rounded-md p-2.5 ${
                                  isActive
                                    ? "bg-primary-100 text-primary-600"
                                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                } ${effectiveExpanded ? "" : "flex justify-center"}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (!effectiveExpanded && !isMobile) {
                                    setSidebarExpanded(true);
                                  }
                                  handleClick();
                                }}
                              >
                                <div
                                  className={`flex items-center ${
                                    effectiveExpanded
                                      ? "justify-between"
                                      : "justify-center"
                                  }`}
                                >
                                  <div
                                    className={`flex items-center ${
                                      effectiveExpanded
                                        ? ""
                                        : "justify-center w-full"
                                    }`}
                                  >
                                    <item.icon
                                      className={`shrink-0 h-4 w-4 ${iconClass} transition-colors duration-200`}
                                    />

                                    {effectiveExpanded && (
                                      <span className="text-sm font-semibold ml-3 transition-opacity duration-200">
                                        {item.name}
                                      </span>
                                    )}
                                  </div>

                                  {effectiveExpanded && (
                                    <div className="flex shrink-0 ml-2">
                                      <div
                                        className={`flex items-center justify-center h-5 w-5 rounded-full transition-all duration-200 ${
                                          open
                                            ? "bg-primary-200 text-primary-600"
                                            : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                                        }`}
                                      >
                                        <ChevronRight
                                          className={`h-3 w-3 transition-transform duration-300 ease-in-out ${
                                            open ? "rotate-90" : ""
                                          }`}
                                          strokeWidth={2.5}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </a>
                            </Tooltip>

                            {/* Submenu */}
                            {effectiveExpanded && (
                              <ul
                                className={`pl-6 mt-2 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                                  open
                                    ? "max-h-[500px] opacity-100"
                                    : "max-h-0 opacity-0"
                                }`}
                              >
                                {item.children.map((child) => {
                                  const isChildActive = pathname === child.path;
                                  //  || pathname.startsWith(`${child.path}/`);
                                  return (
                                    <li
                                      key={child.name}
                                      className="flex items-center gap-2"
                                    >
                                      <span className="relative block w-2 h-2">
                                        {/* Glow */}
                                        {isChildActive && (
                                          <span className="absolute inset-0 rounded-full bg-primary-400 opacity-75 animate-ping"></span>
                                        )}

                                        {/* Main Dot */}
                                        <span
                                          className={`absolute w-1.5 h-1.5 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                                            isChildActive
                                              ? "bg-primary-500"
                                              : "bg-gray-400"
                                          }`}
                                        ></span>
                                      </span>

                                      <NavLink
                                        end
                                        to={child.path}
                                        className={`block py-1 transition duration-150 truncate text-xs ${
                                          isChildActive
                                            ? "text-primary-500"
                                            : "text-gray-600 hover:text-gray-900"
                                        }`}
                                      >
                                        {child.name}
                                      </NavLink>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        )}
                      </SidebarLinkGroup>
                    );
                  } else {
                    return (
                      <Tooltip
                        key={item.name}
                        content={item.name}
                        position="right"
                        disabled={effectiveExpanded || isMobile}
                      >
                        <li
                          className={`p-2.5 mb-0.5 last:mb-0 transition-all duration-200 ${
                            isActive ? "bg-primary-100" : ""
                          } ${
                            effectiveExpanded
                              ? "rounded-sm"
                              : "rounded-lg mx-1 hover:bg-gray-100"
                          }`}
                        >
                          <NavLink
                            end
                            to={item.path}
                            className={`group relative block text-gray-800 truncate transition duration-150 ${
                              isActive
                                ? "text-primary-500 hover:text-primary-600"
                                : "hover:text-gray-900"
                            } ${
                              effectiveExpanded
                                ? ""
                                : "flex items-center justify-center"
                            }`}
                          >
                            <div
                              className={`flex items-center ${
                                effectiveExpanded
                                  ? "justify-between"
                                  : "justify-center"
                              }`}
                            >
                              <div
                                className={`flex items-center ${
                                  effectiveExpanded
                                    ? "grow"
                                    : "justify-center w-full"
                                }`}
                              >
                                <item.icon
                                  className={`shrink-0 h-4 w-4 ${iconClass} transition-colors duration-200`}
                                />

                                {effectiveExpanded && (
                                  <span className="text-sm font-semibold ml-3 transition-opacity duration-200">
                                    {item.name}
                                  </span>
                                )}
                              </div>
                              {effectiveExpanded && item.badge && (
                                <div className="flex flex-shrink-0 ml-2">
                                  <span className="inline-flex items-center justify-center h-5 text-xs font-medium text-white bg-primary-500 px-2 rounded transition-all duration-200">
                                    {item.badge}
                                  </span>
                                </div>
                              )}
                            </div>
                          </NavLink>
                        </li>
                      </Tooltip>
                    );
                  }
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
