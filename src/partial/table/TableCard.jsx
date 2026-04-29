import {
  Eye,
  FileText,
  History,
  Pencil,
  ReceiptIndianRupee,
  Split,
} from "lucide-react";
import ActionMenu from "../../components/ActionMenu";
import StatusBadge from "../../layout/StatusBadge";
import TableStatusBadge from "./TableStatusBadge";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DynamicTableShape from "./DynamicTableShape";

const TableCard = ({
  table,
  mergeMode,
  selectedTables = [],
  toggleTableSelection,
  isTableSelectableForMerge = () => false,
  onUpdate,
  handleSplitTable,
  onChangeTable,
}) => {
  const { tableToSplitId } = useSelector((state) => state.table);
  const isSelected = selectedTables.includes(table.id);
  const isSelectable = mergeMode && isTableSelectableForMerge(table);

  const handleCardClick = () => {
    if (!mergeMode) return;
    if (!isSelectable) return;
    toggleTableSelection(table);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        bg-white rounded-xl border overflow-hidden transition-all
        ${isSelected ? "border-indigo-500" : "border-gray-200 hover:shadow-md"}
        ${table.status === "merged" ? "border-amber-400 opacity-70" : ""}
        ${table.is_active !== 1 ? "opacity-60 grayscale" : ""}
        ${
          mergeMode
            ? isSelectable
              ? "cursor-pointer"
              : "opacity-40 cursor-not-allowed"
            : ""
        }
      `}
    >
      <div className="bg-gray-50 p-6 flex items-center justify-center h-48 relative">
        <DynamicTableShape
          shape={table.shape}
          status={table.status}
          capacity={table.capacity}
        />

        {mergeMode && isSelected && (
          <span className="absolute bottom-2 right-2 text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded">
            Selected
          </span>
        )}

        {mergeMode && isSelected && selectedTables[0] === table.id && (
          <span className="absolute top-2 right-2 text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded">
            Primary
          </span>
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {table.table_number}
            </h3>
            <p className="text-xs text-gray-500">{table.name}</p>
          </div>

          {!mergeMode && (
            <ActionMenu
              items={[
                ...(table.status === "merged"
                  ? [
                      {
                        label: "Unmerge",
                        icon: Split,
                        color: "rose",
                        onClick: () => handleSplitTable(table.id),
                      },
                    ]
                  : []),

                ...(["occupied", "running"].includes(table.status) &&
                table.is_active === 1 &&
                table.status !== "merged"
                  ? [
                      {
                        label: "Change Table",
                        icon: History, // You can use a better icon if needed
                        color: "blue",
                        onClick: () => onChangeTable?.(table),
                      },
                    ]
                  : []),

                {
                  label: "Edit",
                  icon: Pencil,
                  color: "emerald",
                  onClick: () => onUpdate(table),
                },
              ]}
              loading={tableToSplitId === table.id}
            />
          )}
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <p>
            Capacity : {table.capacity} (Min {table.min_capacity})
          </p>
        </div>

        <div className="flex gap-2 mt-2 text-xs">
          <StatusBadge value={table.is_active === 1} />
          <TableStatusBadge status={table.status} />

          {table.is_mergeable === 1 && table.status !== "merged" && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
              Mergeable
            </span>
          )}
        </div>

        {table.order_number && (
          <div className="mt-3 text-xs text-gray-700 bg-gray-50 p-2 rounded">
            <p>Guest: {table.guest_name || "-"}</p>
            <p>Guests Count: {table.guest_count}</p>
            <p>Order #: {table.order_number}</p>
            <p>Total: ₹{table.total_amount}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableCard;
