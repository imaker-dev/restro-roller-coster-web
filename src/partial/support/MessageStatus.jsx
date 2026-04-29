import { Check, CheckCheck } from "lucide-react";

export const MessageStatus = ({
  time,
  status,
  isOut,
  variant = "text", // "text" | "file" | "image"
}) => {
  //  Color system
  const styles = {
    text: isOut ? "text-primary-100" : "text-gray-400",
    file: isOut ? "text-primary-100" : "text-gray-400",
    image: isOut ? "text-emerald-200" : "text-gray-500",
  };

  const iconStyles = {
    default: isOut ? "" : "",
    read: "text-emerald-300",
  };

  return (
    <div
      className={`flex items-center justify-end gap-1 mt-1 ${styles[variant]}`}
    >
      {/* Time */} <span className="text-[10px] leading-none">{time}</span>
      {/* Status ticks (only outgoing) */}
      {isOut &&
        (status === "read" ? (
          <CheckCheck size={12} className={iconStyles.read} />
        ) : status === "delivered" ? (
          <CheckCheck size={12} />
        ) : (
          <Check size={12} />
        ))}
    </div>
  );
};
