import React, { useEffect, useRef, useState, useCallback } from "react";
import UserAvatar from "../../components/UserAvatar";
import {
  ArrowLeft,
  Hash,
  Info,
  Loader2,
  Lock,
  MessageSquare,
  MoreVertical,
  RefreshCw,
} from "lucide-react";
import SupportBadge from "./SupportBadge";
import { MessageBubble } from "./MessageBubble";
import { ChatFooter } from "./ChatFooter";
import NoDataFound from "../../layout/NoDataFound";

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center bg-[#f0f2f5] gap-5 p-8">
    <NoDataFound
      icon={MessageSquare}
      title="Support Center"
      description="Select a conversation to help your customers. Manage tickets, reply to queries and track resolutions."
      className="max-w-sm"
    />
  </div>
);

// ─── ChatScreen ───────────────────────────────────────────────────────────────
const ChatScreen = ({
  mobileView,
  setMobileView,
  showInfo,
  onViewInfo,
  onStatusChange,
  activeContact,
  messages,
  sending,
  handleSend,
}) => {
  const [input, setInput] = useState("");
  const [pendingFiles, setPendingFiles] = useState([]);

  const messagesEndRef = useRef(null);

  // Reset input whenever the active contact changes
  useEffect(() => {
    setInput("");
    setPendingFiles([]);
  }, [activeContact?.id]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeContact]);

  const resetForm = useCallback(() => {
    setInput("");
    setPendingFiles([]);
  }, []);

  // Called by ChatFooter — passes everything the parent needs
  const handleSubmit = useCallback(() => {
    const text = input.trim();
    const files = pendingFiles;

    if (!text && files.length === 0) return;
    if (sending) return;

    handleSend({ input: text, pendingFiles: files, resetForm });
  }, [input, pendingFiles, sending, handleSend, resetForm]);

  const isClosed = activeContact?.status === "closed";

  if (!activeContact) {
    return (
      <div
        className={`${mobileView === "list" ? "hidden lg:flex" : "flex"} flex-1`}
      >
        <EmptyState />
      </div>
    );
  }

  return (
    <div
      className={`${mobileView === "list" ? "hidden lg:flex" : "flex"} flex-1 flex-col bg-[#efeae2] min-w-0`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4cfc8' fill-opacity='0.25'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }}
    >
      {/* ── Chat Header ── */}
      <div className="bg-[#f0f2f5] border-b border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0">
        {/* Mobile back */}
        <button
          className="lg:hidden p-1.5 rounded-xl hover:bg-gray-200 transition-colors shrink-0"
          onClick={() => setMobileView("list")}
        >
          <ArrowLeft size={17} className="text-gray-600" />
        </button>

        {/* Contact info (clickable → open info panel) */}
        <button
          className="flex items-center gap-3 flex-1 min-w-0 text-left"
          onClick={() => onViewInfo((s) => !s)}
        >
          <UserAvatar name={activeContact.name} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-black text-gray-900 truncate">
                {activeContact.name}
              </p>
              <SupportBadge status={activeContact.status} size="sm" />
            </div>
            <p className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
              {activeContact.online ? (
                <>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                  Online
                </>
              ) : (
                "Last seen recently"
              )}
              <span className="text-gray-300">·</span>
              <Hash size={9} />
              {activeContact.issue}
            </p>
          </div>
        </button>

        {/* Header actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onStatusChange}
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-gray-600 bg-white hover:bg-gray-100 px-3 py-1.5 rounded-xl transition-colors border border-gray-200"
          >
            <RefreshCw size={11} /> Status
          </button>
          <button
            onClick={() => onViewInfo((s) => !s)}
            className={`w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-200 transition-colors ${showInfo ? "bg-gray-200" : ""}`}
          >
            <Info size={16} className="text-gray-600" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-200 transition-colors">
            <MoreVertical size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-6 py-4">
        <div className="flex justify-center mb-4">
          <span className="text-[11px] font-semibold text-gray-500 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
            Today
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <MessageSquare size={24} className="text-gray-300" />
            <p className="text-sm text-gray-400 font-medium">No messages yet</p>
            <p className="text-xs text-gray-400">Start the conversation</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble key={msg.id} msg={msg} prevMsg={messages[i - 1]} />
          ))
        )}

        {sending && (
          <div className="flex justify-end mt-2">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
              <Loader2 size={10} className="animate-spin" /> Sending...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Closed Banner ── */}
      {isClosed && (
        <div className="bg-gray-100 border-t border-gray-200 px-5 py-4 flex flex-col items-center justify-center gap-2">
          <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
            <Lock size={14} className="text-gray-500" />
            This ticket is closed
          </p>
          <p className="text-xs text-gray-400">
            Messaging is disabled. Reopen to continue the conversation.
          </p>
        </div>
      )}

      {/* ── Chat Footer — hidden when closed ── */}
      {!isClosed && (
        <ChatFooter
          input={input}
          setInput={setInput}
          pendingFiles={pendingFiles}
          setPendingFiles={setPendingFiles}
          onSend={handleSubmit}
          sending={sending}
          disabled={false}
        />
      )}
    </div>
  );
};

export default ChatScreen;