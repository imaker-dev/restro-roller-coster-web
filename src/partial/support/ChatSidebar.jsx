import React from "react";
import {
  Bell,
  Headphones,
  MessageSquare,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import SupportBadge from "./SupportBadge";
import UserAvatar from "../../components/UserAvatar";
import NoDataFound from "../../layout/NoDataFound";

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "urgent", label: "Urgent" },
  { key: "open", label: "Open" },
  { key: "resolved", label: "Resolved" },
  { key: "closed", label: "Closed" },
];

const ChatSidebar = ({
  mobileView,
  totalUnread,
  search,
  setSearch,
  activeFilter,
  setActiveFilter,
  contacts,
  activeContact,
  onSelect,
}) => {
  return (
    <div
      className={`${mobileView === "chat" ? "hidden lg:flex" : "flex"} flex-col w-full lg:w-80 xl:w-88 bg-white border-r border-gray-200 shrink-0`}
      style={{ width: mobileView === "chat" ? undefined : undefined }}
    >
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center shadow-sm">
              <Headphones size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900 leading-none">
                Support
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {totalUnread > 0 ? `${totalUnread} unread` : "All caught up"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors relative">
              <Bell size={15} className="text-gray-500" />
              {totalUnread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary-500 rounded-full" />
              )}
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
              <SlidersHorizontal size={15} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="w-full bg-gray-100 rounded-xl pl-8.5 pr-8 py-2.5 text-xs text-gray-800 placeholder-gray-400 outline-none focus:bg-gray-200 transition-colors"
            style={{ paddingLeft: "2rem" }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={12} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-gray-100 bg-white overflow-x-auto hide-scrollbar">
        {FILTER_TABS.map(({ key, label }) => {
          const count =
            key === "all"
              ? contacts.length
              : contacts.filter((c) => c.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-bold whitespace-nowrap border-b-2 transition-all shrink-0 ${
                activeFilter === key
                  ? "text-primary-500 border-primary-500"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              }`}
            >
              {label}
              {count > 0 && (
                <span
                  className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                    activeFilter === key
                      ? "bg-primary-500/10 text-primary-500"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto thin-scrollbar">
        {contacts.length === 0 ? (
          <NoDataFound
            icon={MessageSquare}
            title="No conversations"
            description="Try a different filter"
            size="sm"
          />
        ) : (
          contacts.map((contact) => {
            const isActive = activeContact?.id === contact.id;
            return (
              <button
                key={contact.id}
                onClick={() => onSelect(contact)}
                className={`w-full flex items-start gap-3 px-4 py-3.5 border-b border-gray-50 transition-colors text-left ${isActive ? "bg-primary-100" : "hover:bg-gray-50"}`}
              >
                <UserAvatar
                  name={contact.name}
                  status={contact.online}
                  className="w-10 h-10 text-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5 gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {contact.pinned && (
                        <Star
                          size={9}
                          className="text-amber-400 fill-amber-400 shrink-0"
                        />
                      )}
                      <span className="text-sm font-bold text-gray-900 truncate">
                        {contact.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-gray-400">
                        {contact.time}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate mb-1.5">
                    {contact.lastMessage}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <SupportBadge status={contact.status} size="xs" />

                      <span className="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                        {contact.issue}
                      </span>
                    </div>
                    {contact.unread > 0 && (
                      <span className="w-4 h-4 bg-emerald-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center leading-none shrink-0">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
