import { CheckCircle2, ChefHat, Package, Ticket, XCircle } from "lucide-react";
import MetaPill from "../../../components/MetaPill";

export default function StationCard({ station }) {
  return (
    <div
      className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300
      hover:-translate-y-1 hover:shadow group border border-primary-200`}
    >
      {/* Ambient glow */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity duration-300 bg-primary-500/20" />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-primary-500 text-white">
              <ChefHat size={20} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <p className="text-[15px] font-black text-slate-900 leading-tight truncate">
                {station.stationName}
              </p>
              <p className="text-xs text-slate-500 capitalize">
                {station.stationType}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <MetaPill
            icon={Ticket}
            label="KOT"
            value={station.ticketCount}
            highlight
          />

          <MetaPill
            icon={Package}
            label="Qty"
            value={`${station.totalQuantity} • ${station.itemCount} items`}
          />

          <MetaPill
            icon={CheckCircle2}
            label="Served"
            value={station.servedCount}
          />

          <MetaPill
            icon={XCircle}
            label="Cancelled"
            value={station.cancelledCount}
          />
        </div>
      </div>
    </div>
  );
}
