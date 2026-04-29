import React from "react";
import Shimmer from "./Shimmer";

export default function AppLayoutSkeleton() {
  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <SidebarSkeleton />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <HeaderSkeleton />
        <ContentSkeleton />
      </div>
    </div>
  );
}

//////////////////////////////////////////////////////
// SIDEBAR SKELETON
//////////////////////////////////////////////////////
function SidebarSkeleton() {
  return (
    <div className="min-w-fit hidden xl:block relative">
      <div className="flex flex-col h-[100dvh] shrink-0 bg-white border-r border-gray-200 w-64">
        {/* Sidebar header */}
        <div className="bg-white px-4 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center h-16">
            <Shimmer width="140px" height="24px" />
          </div>
        </div>

        {/* Links */}
        <div className="space-y-6 p-4 flex-1 overflow-hidden">
          {[1, 2, 3].map((group) => (
            <div key={group}>
              {/* Group Title */}
              <Shimmer width="60px" height="10px" className="mb-3" />

              <ul className="space-y-2">
                {[1, 2, 3, 4].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 px-2 py-2 rounded-md"
                  >
                    {/* Icon */}
                    <Shimmer width="16px" height="16px" />

                    {/* Text */}
                    <Shimmer width="120px" height="14px" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

//////////////////////////////////////////////////////
// HEADER SKELETON
//////////////////////////////////////////////////////
function HeaderSkeleton() {
  return (
    <header className="sticky top-0 bg-white border-b border-slate-200 z-30">
      <div className="px-4 sm:px-6 xl:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left */}
          <Shimmer width="24px" height="24px" />

          {/* Right */}
          <div className="flex items-center gap-3">
            <Shimmer width="32px" height="32px" rounded="full" />
            <Shimmer width="32px" height="32px" rounded="full" />
            <Shimmer width="1px" height="24px" />
            <Shimmer width="36px" height="36px" rounded="full" />
          </div>
        </div>
      </div>
    </header>
  );
}

//////////////////////////////////////////////////////
// CONTENT SKELETON
//////////////////////////////////////////////////////
function ContentSkeleton() {
  return (
    <main className="grow bg-gray-100">
      <div className="p-4 sm:p-6 w-full container max-w-10xl mx-auto h-full">
        <div className="flex items-center justify-center h-full">
          <div className="relative flex items-center justify-center">
            {/* Soft Glow Background */}
            <div className="absolute w-40 h-40 sm:w-52 sm:h-52 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />

            {/* Animated Logo */}
            <img
              src="/Images/Logo.svg"
              alt="logo"
              className="relative w-28 sm:w-36 md:w-44 lg:w-52 animate-pulse"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
