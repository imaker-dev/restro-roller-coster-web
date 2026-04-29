import { Layers } from "lucide-react";
import RunningTableCard from "./RunningTableCard";
import { formatNumber } from "../../../utils/numberFormatter";


const FloorSection = ({floor}) => {
  return (
    <div>
    {/* Floor header */}
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center">
        <Layers size={15} color="white" strokeWidth={2.2} />
      </div>
      <div>
        <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
          {floor?.floorName}
        </h2>
        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
          {floor?.tableCount} tables · {floor?.totalGuests} guests
          {floor?.totalAmount > 0 &&
            ` · ${formatNumber(floor?.totalAmount, true)}`}
        </p>
      </div>
    </div>

    {/* Tables grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {floor?.tables.map((table) => (
        <RunningTableCard key={table?.tableId} table={table} />
      ))}
    </div>
  </div>
  )
}

export default FloorSection
