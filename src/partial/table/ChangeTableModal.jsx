import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import ModalBasic from "../../components/ModalBasic";

const ChangeTableModal = ({
  isOpen,
  onClose,
  tableToMove,
  sections = [],
  onConfirm,
  loading = false,
}) => {
  const [selectedTableId, setSelectedTableId] = useState(null);

  const availableSections = sections
    .map((section) => ({
      ...section,
      tables: (section.tables || []).filter(
        (t) =>
          t.status === "available" &&
          t.is_active === 1 &&
          t.status !== "merged",
      ),
    }))
    .filter((section) => section.tables.length > 0);

  const selectedTable = availableSections
    .flatMap((s) => s.tables)
    .find((t) => t.id === selectedTableId);

  const handleConfirm = () => {
    if (!selectedTableId) return;
    onConfirm(selectedTableId);
  };

  {
    /* Modal */
  }
  return (
    <ModalBasic
      id={"change-table"}
      title={"Transfer Table"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className=" bg-white rounded-3xl">
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <p className="text-sm text-slate-500 mt-1">
            Moving order from{" "}
            <span className="font-semibold text-slate-700">
              Table {tableToMove?.table_number}
            </span>
          </p>

          {availableSections.length === 0 ? (
            <div className="text-center text-slate-500 py-10">
              No available tables found.
            </div>
          ) : (
            availableSections.map((section) => (
              <div key={section?.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: section?.color_code }}
                  />
                  <h3 className="text-lg font-semibold text-slate-800">
                    {section?.name}
                  </h3>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {section?.tables?.map((table) => {
                    const isSelected = selectedTableId === table.id;

                    return (
                      <button
                        key={table?.id}
                        onClick={() => setSelectedTableId(table?.id)}
                        className={`
                          relative p-5 rounded-2xl border text-center
                          transition-all duration-200
                          ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-50 shadow-md scale-[1.03]"
                              : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                          }
                        `}
                      >
                        <div className="text-lg font-semibold text-slate-800">
                          {table?.table_number}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Capacity {table?.capacity}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
          <div className="text-sm text-slate-600">
            {selectedTable
              ? `Ready to transfer to Table ${selectedTable?.table_number}`
              : "Select a destination table"}
          </div>

          <button
            onClick={handleConfirm}
            disabled={!selectedTableId || loading}
            className={`
              btn flex items-center gap-2 py-2.5 rounded-xl
              ${
                selectedTableId
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-slate-300 text-slate-600 cursor-not-allowed"
              }
            `}
          >
            {loading ? "Transferring..." : "Confirm Transfer"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </ModalBasic>
  );
};

export default ChangeTableModal;
