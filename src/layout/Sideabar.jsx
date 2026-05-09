import React, { useEffect, useRef, useState, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SidebarLinkGroup from "./SidebarLinkGroup";
import { navConfig } from "../config/nav-config";
import { ChevronRight, ChevronsLeft, Search, X, Command } from "lucide-react";
import { hasAccess } from "../utils/accessControl";
import { useSelector } from "react-redux";
import Tooltip from "../components/Tooltip";
import { LOGO, LOGO_ICON } from "../constants";

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
  const searchInputRef = useRef(null);

  const [isMobile, setIsMobile] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const effectiveExpanded = isMobile ? true : sidebarExpanded;

  // Auto-expand sidebar when searching
  useEffect(() => {
    if (isSearchVisible && !sidebarExpanded && !isMobile) {
      setSidebarExpanded(true);
    }
  }, [isSearchVisible]);

  // Focus search input when visible
  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 200);
    }
  }, [isSearchVisible]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchVisible(true);
      }
      if (e.key === "Escape" && isSearchVisible) {
        setIsSearchVisible(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchVisible]);

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

  const filteredNavConfig = useMemo(() => {
    return navConfig
      .map((group) => {
        const filteredItems = group.items
          .map((item) => {
            if (item.children) {
              const parentAllowed = hasAccess({
                userRole,
                userPermissions,
                userId,
                path: item.path,
                roles: item.roles,
                permissions: item.permissions,
                public: item.public,
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
                  public: child.public,
                }),
              );

              return children.length ? { ...item, children } : null;
            }

            return hasAccess({
              userRole,
              userPermissions,
              userId,
              path: item.path,
              roles: item.roles,
              permissions: item.permissions,
              public: item.public,
            })
              ? item
              : null;
          })
          .filter(Boolean);

        return filteredItems.length ? { ...group, items: filteredItems } : null;
      })
      .filter(Boolean);
  }, [userRole, userPermissions, userId]);

  const searchedNavConfig = useMemo(() => {
    if (!searchQuery.trim()) return filteredNavConfig;

    const query = searchQuery.toLowerCase().trim();

    return filteredNavConfig
      .map((group) => {
        const searchedItems = group.items
          .map((item) => {
            if (item.children) {
              const matchingChildren = item.children.filter(
                (child) =>
                  child.name.toLowerCase().includes(query) ||
                  child.path?.toLowerCase().includes(query),
              );

              const parentMatches = item.name.toLowerCase().includes(query);

              if (parentMatches || matchingChildren.length > 0) {
                return {
                  ...item,
                  children: parentMatches ? item.children : matchingChildren,
                  _searchHighlight: true,
                };
              }
              return null;
            }

            if (
              item.name.toLowerCase().includes(query) ||
              item.path?.toLowerCase().includes(query)
            ) {
              return { ...item, _searchHighlight: true };
            }
            return null;
          })
          .filter(Boolean);

        return searchedItems.length ? { ...group, items: searchedItems } : null;
      })
      .filter(Boolean);
  }, [filteredNavConfig, searchQuery]);

  const highlightMatch = (text) => {
    if (!searchQuery.trim() || !isSearchVisible) return text;

    const regex = new RegExp(
      `(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi",
    );
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <span
          key={i}
          className="text-gray-900 font-semibold bg-amber-200/80 rounded px-0.5"
        >
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="min-w-fit relative">
      {/* Collapse Button */}
      <div className="hidden xl:block absolute -right-3 top-6 z-40">
        <Tooltip
          content={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          position="right"
        >
          <button
            onClick={() => {
              setSidebarExpanded(!sidebarExpanded);
              if (!sidebarExpanded) {
                setIsSearchVisible(false);
                setSearchQuery("");
              }
            }}
            className="p-1 group relative flex items-center justify-center rounded-full bg-white border border-gray-200 shadow hover:shadow-lg hover:bg-gray-50 transition-all duration-200"
          >
            <span className="sr-only">Toggle sidebar</span>
            <ChevronsLeft
              className={`w-3.5 h-3.5 text-gray-600 transition-transform duration-300 ease-in-out ${
                !sidebarExpanded ? "rotate-180" : ""
              }`}
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
        <div className="bg-white px-4 border-b border-gray-200 sticky top-0 z-10">
          {/* Logo */}
          <NavLink
            end
            to="/"
            className={`flex items-center ${effectiveExpanded ? "justify-start" : "justify-center"} h-16`}
          >
            {effectiveExpanded ? (
              <img src={LOGO} alt="" className="w-40" />
            ) : (
              <img src={LOGO_ICON} className="w-8" />
            )}
          </NavLink>
        </div>
        {/* Search Area */}
        {effectiveExpanded && (
          <div className="px-4 py-2">
            {!isSearchVisible ? (
              <button
                onClick={() => setIsSearchVisible(true)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-500 
                    hover:text-gray-700 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors group"
              >
                <Search className="w-4 h-4" />
                <span className="flex-1 text-left">Search</span>

                <kbd className="text-[10px] font-medium text-gray-400 bg-gray-100 group-hover:bg-gray-200 px-1.5 py-0.5 rounded transition-colors">
                  Ctrl + K
                </kbd>
              </button>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search menus..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-1.5 text-sm border border-gray-200 rounded-lg
                      focus:outline-none focus:border-gray-300
                      placeholder:text-gray-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-8 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-100"
                  >
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsSearchVisible(false);
                    setSearchQuery("");
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 hover:text-gray-600"
                >
                  ESC
                </button>
              </div>
            )}
          </div>
        )}

        {/* Links */}
        <div
          className={`space-y-6 p-4 flex-1 overflow-y-auto no-scrollbar ${
            effectiveExpanded ? "" : "space-y-4"
          }`}
        >
          {isSearchVisible && searchQuery && searchedNavConfig.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No results found</p>
              <p className="text-xs text-gray-400 mt-1">
                Try a different search term
              </p>
            </div>
          ) : (
            searchedNavConfig.map((group) => (
              <div key={group.title}>
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
                          defaultOpen={item._searchHighlight && !!searchQuery}
                        >
                          {(handleClick, open) => (
                            <div className="group relative">
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
                                      : item._searchHighlight && searchQuery
                                        ? "bg-gray-50 hover:bg-gray-100"
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
                                          {highlightMatch(item.name)}
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
                                    const isChildActive =
                                      pathname === child.path;
                                    return (
                                      <li
                                        key={child.name}
                                        className="flex items-center gap-2"
                                      >
                                        <span className="relative block w-2 h-2">
                                          {isChildActive && (
                                            <span className="absolute inset-0 rounded-full bg-primary-400 opacity-75 animate-ping"></span>
                                          )}
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
                                          onClick={() => {
                                            setIsSearchVisible(false);
                                            setSearchQuery("");
                                          }}
                                          className={`block py-1 transition duration-150 truncate text-xs ${
                                            isChildActive
                                              ? "text-primary-500"
                                              : "text-gray-600 hover:text-gray-900"
                                          }`}
                                        >
                                          {highlightMatch(child.name)}
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
                              isActive
                                ? "bg-primary-100"
                                : item._searchHighlight && searchQuery
                                  ? "bg-gray-50 hover:bg-gray-100"
                                  : ""
                            } ${
                              effectiveExpanded
                                ? "rounded-sm"
                                : "rounded-lg mx-1 hover:bg-gray-100"
                            }`}
                          >
                            <NavLink
                              end
                              to={item.path}
                              onClick={() => {
                                setIsSearchVisible(false);
                                setSearchQuery("");
                              }}
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
                                      {highlightMatch(item.name)}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
