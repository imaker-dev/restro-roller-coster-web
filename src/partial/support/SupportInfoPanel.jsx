import {
  Archive,
  BellOff,
  Hash,
  Phone,
  RefreshCw,
  Star,
  Tag,
  Trash2,
  User,
  X,
} from "lucide-react";
import SupportBadge from "./SupportBadge";
import UserAvatar from "../../components/UserAvatar";

// ─── Info Panel ───────────────────────────────────────────────────────────────
const SupportInfoPanel = ({ contact, onClose, onStatusChange }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
      />

      {/* Panel */}
      <div
        className={`
          fixed inset-y-0 right-0 z-50
          w-full sm:w-80
          bg-[#f8fafc] border-l border-gray-200 flex flex-col
          transition-transform duration-300
          lg:static lg:w-72 xl:w-80
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
          <p className="text-sm font-black text-gray-900">Ticket Info</p>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X size={15} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Profile block */}
          <div className="bg-white px-5 py-6 flex flex-col items-center text-center border-b border-gray-100">
            <UserAvatar name={contact.name} status={contact.online} size="xl" />

            <p className="text-base font-black text-gray-900">{contact.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{contact.phone}</p>

            <div className="mt-3">
              <SupportBadge status={contact.status} />
            </div>

            <button
              onClick={(e) => onStatusChange(e)}
              className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-colors border border-gray-200"
            >
              <RefreshCw size={11} /> Change Status
            </button>
          </div>

          {/* Ticket Details */}
          <div className="p-4 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 mb-3">
              Ticket Details
            </p>

            {[
              { icon: Hash, label: "Order ID", value: contact.orderId },
              { icon: Tag, label: "Issue Type", value: contact.issue },
              { icon: User, label: "Customer", value: contact.name },
              { icon: Phone, label: "Phone", value: contact.phone },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-3 border border-gray-100"
              >
                <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={12} className="text-gray-500" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 font-medium">
                    {label}
                  </p>
                  <p className="text-xs font-bold text-gray-800 truncate">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="px-4 pb-4 space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 mb-3">
              Actions
            </p>
            {[
              // { icon: Star,    label: "Pin Conversation", color: "text-amber-600",  bg: "hover:bg-amber-50" },
              // { icon: Archive, label: "Archive Chat",     color: "text-blue-600",   bg: "hover:bg-blue-50"  },
              // { icon: BellOff, label: "Mute Notifications",color: "text-gray-600",  bg: "hover:bg-gray-100" },
              {
                icon: Trash2,
                label: "Delete Ticket",
                color: "text-red-600",
                bg: "hover:bg-red-50",
              },
            ].map(({ icon: Icon, label, color, bg }) => (
              <button
                key={label}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl ${bg} transition-colors border border-transparent hover:border-gray-100`}
              >
                <Icon size={15} className={color} />
                <span className={`text-xs font-bold ${color}`}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportInfoPanel;