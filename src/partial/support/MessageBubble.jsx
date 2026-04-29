import { Lock } from "lucide-react";
import { FileBubble } from "./FileBubble";
import { MessageStatus } from "./MessageStatus";

// ─── Message Bubble ───────────────────────────────────────────────────────────
export const MessageBubble = ({ msg, prevMsg }) => {
  const isOut = msg.type === "outgoing";
  const isSystem = msg.type === "system";
  const consecutive = prevMsg && prevMsg.type === msg.type;

  if (isSystem)
    return (
      <div className="flex justify-center my-3">
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur border border-gray-200 text-gray-500 text-[11px] font-semibold px-4 py-1.5 rounded-full shadow-sm">
          <Lock size={10} className="text-gray-400" />
          {msg.text}
          <span className="text-gray-400 font-normal">· {msg.time}</span>
        </div>
      </div>
    );

  return (
    <div
      className={`flex ${isOut ? "justify-end" : "justify-start"} ${consecutive ? "mt-0.5" : "mt-3"}`}
    >
      <div className={`max-w-[70%] space-y-1`}>
        {/* File attachments */}
        {msg.files?.map((f, i) => (
          <div
            key={i}
            className={`flex ${isOut ? "justify-end" : "justify-start"}`}
          >
            <FileBubble
              file={f}
              isOut={isOut}
              time={msg.time}
              status={msg.status}
            />
          </div>
        ))}

        {/* Text */}
        {msg.text && (
          <div
            className={`group relative px-3.5 py-2.5 rounded-2xl shadow-sm ${
              isOut
                ? "bg-primary-500 text-white rounded-br-sm"
                : "bg-white text-gray-900 rounded-bl-sm border border-gray-100"
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {msg.text}
            </p>

            <MessageStatus
              time={msg.time}
              status={msg.status}
              isOut={isOut}
              variant="text"
            />
          </div>
        )}
      </div>
    </div>
  );
};
