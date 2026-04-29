import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "../../hooks/useQueryParams";
import {
  fetchAllSectionWithTables,
  createSection,
  updateSection,
} from "../../redux/slices/sectionSlice";
import {
  createTable,
  mergeTable,
  splitTable,
  updateTable,
} from "../../redux/slices/tableSlice";
import { Loader2, Plus, RotateCcw } from "lucide-react";
import PageHeader from "../../layout/PageHeader";
import SectionModal from "../../partial/section/SectionModal";
import TableModal from "../../partial/table/TableModal";
import TableCard from "../../partial/table/TableCard";
import NoDataFound from "../../layout/NoDataFound";
import SectionCardSkeleton from "../../partial/table/SectionCardSkeleton";
import { emitUpdateTable } from "../../socket/socketEmitters";
import { TABLE_MERGED, TABLE_UNMERGED } from "../../socket/socketEvents";
import { handleResponse } from "../../utils/helpers";
import ChangeTableModal from "../../partial/table/ChangeTableModal";

const canSelectForMerge = (table) =>
  table.status === "available" &&
  table.is_mergeable === 1 &&
  table.is_active === 1 &&
  table.status !== "merged";

const AllTablesPage = () => {
  const dispatch = useDispatch();
  const { floorId } = useQueryParams();
  const { outletId } = useSelector((state) => state.auth);

  const {
    allSectionsWithTables,
    loading,
    isCreatingSections,
    isUpdatingSections,
  } = useSelector((state) => state.section);
  const { isCreatingTable, isUpdatingTable, isMergingTable } = useSelector(
    (state) => state.table,
  );

  const { floor_name, sections = [] } = allSectionsWithTables || {};

  const [showSectionModal, setShowSectionModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  const [showTableModal, setShowTableModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  const [mergeMode, setMergeMode] = useState(false);
  const [activeMergeSectionId, setActiveMergeSectionId] = useState(null);
  const [selectedTables, setSelectedTables] = useState([]);

  const [showChangeTableModal, setShowChangeTableModal] = useState(false);
  const [tableToMove, setTableToMove] = useState(null);

  const fetchTables = () => {
    dispatch(fetchAllSectionWithTables(floorId));
  };

  useEffect(() => {
    if (floorId) {
      fetchTables();
    }
  }, [floorId, dispatch]);

  const startMergeMode = (sectionId) => {
    setMergeMode(true);
    setActiveMergeSectionId(sectionId);
    setSelectedTables([]);
  };

  const cancelMergeMode = () => {
    setMergeMode(false);
    setActiveMergeSectionId(null);
    setSelectedTables([]);
  };

  const toggleTableSelection = (table) => {
    if (!mergeMode) return;
    if (!canSelectForMerge(table)) return;

    setSelectedTables((prev) =>
      prev.includes(table.id)
        ? prev.filter((id) => id !== table.id)
        : [...prev, table.id],
    );
  };

  const resetModals = () => {
    setShowSectionModal(false);
    setShowTableModal(false);
    setSelectedSection(null);
    setSelectedTable(null);
    setSelectedSectionId(null);
  };

  const handleSectionSubmit = async ({ id, values, resetForm }) => {
    const action = id ? updateSection({ id, values }) : createSection(values);

    await handleResponse(dispatch(action), () => {
      dispatch(fetchAllSectionWithTables(floorId));
      resetForm();
      resetModals();
    });
  };

  const handleTableSubmit = async ({ id, values, resetForm }) => {
    const payload = { ...values, section_id: selectedSectionId };

    const action = id
      ? updateTable({ id, values: payload })
      : createTable(payload);

    await handleResponse(dispatch(action), () => {
      dispatch(fetchAllSectionWithTables(floorId));
      resetForm();
      resetModals();
    });
  };

  const handleMergeTables = async () => {
    if (selectedTables.length < 2) return;

    const [primaryTableId, ...otherTableIds] = selectedTables;

    await handleResponse(
      dispatch(
        mergeTable({
          id: primaryTableId,
          values: { tableIds: otherTableIds },
        }),
      ),
      () => {
        emitUpdateTable(TABLE_MERGED, { tableId: primaryTableId });
        cancelMergeMode();
        fetchTables();
      },
    );
  };

  const handleSplitTable = async (id) => {
    await handleResponse(dispatch(splitTable(id)), () => {
      emitUpdateTable(TABLE_UNMERGED, { tableId: id });
      fetchTables();
    });
  };

  const handleChangeTable = async (toTableId) => {
    if (!tableToMove) return;
    const fromTableId = tableToMove.id;

    // Prevent invalid move
    if (fromTableId === toTableId) return;

    // await handleResponse(
    //   dispatch(
    //     changeTable({
    //       fromTableId,
    //       toTableId,
    //     })
    //   ),
    //   () => {
    //     // Optional socket emit
    //     emitUpdateTable("TABLE_CHANGED", {
    //       fromTableId,
    //       toTableId,
    //     });

    //     // Close modal
    //     setShowChangeTableModal(false);
    //     setTableToMove(null);

    //     // Refresh data
    //     fetchTables();
    //   }
    // );
  };

  const actions = [
    {
      label: "Add Section",
      type: "primary",
      icon: Plus,
      onClick: () => {
        setSelectedSection(null);
        setShowSectionModal(true);
      },
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchTables,
      loading: loading,
      loadingText: "Refreshing...",
    },
  ];

  return (
    <>
      <div className="space-y-8">
        <PageHeader
          title={
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">
              {floor_name} — Table Board
            </span>
          }
          showBackButton
          actions={actions}
        />

        {loading ? (
          <div className="space-y-10">
            {Array.from({ length: 2 }).map((_, i) => (
              <SectionCardSkeleton key={i} />
            ))}
          </div>
        ) : sections && sections.length > 0 ? (
          /* ================= SECTIONS AVAILABLE ================= */
          sections.map((section) => {
            const isActive = mergeMode && activeMergeSectionId === section.id;

            const tables = section.tables || [];

            const mergeableTables = tables.filter(
              (t) =>
                t.status === "available" &&
                t.is_mergeable === 1 &&
                t.is_active === 1,
            );

            const canShowMergeButton = mergeableTables.length > 1;

            return (
              <div
                key={section.id}
                className={`rounded-3xl p-6 transition-all duration-300
                bg-gradient-to-br from-white to-slate-50 border
                ${
                  isActive
                    ? "border-indigo-500 shadow shadow-indigo-100"
                    : "border-slate-200 hover:shadow-md"
                }`}
              >
                {/* HEADER */}
                <div className="flex justify-between items-start mb-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: section.color_code }}
                      />
                      <h2 className="text-2xl font-extrabold text-slate-800">
                        {section.name}
                      </h2>
                    </div>

                    {section.description && (
                      <p className="text-sm text-slate-500 max-w-md">
                        {section.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {canShowMergeButton && (
                      <button
                        onClick={() =>
                          isActive
                            ? cancelMergeMode()
                            : startMergeMode(section.id)
                        }
                        className={`px-5 py-2 rounded-xl font-semibold transition-all
                      ${
                        isActive
                          ? "bg-rose-500 text-white hover:bg-rose-600"
                          : "bg-amber-500 text-white hover:bg-amber-600"
                      }`}
                      >
                        {isActive ? "Cancel Merge" : "Merge Tables"}
                      </button>
                    )}

                    {!mergeMode && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedSection(section);
                            setShowSectionModal(true);
                          }}
                          className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            setSelectedSectionId(section.id);
                            setSelectedTable(null);
                            setShowTableModal(true);
                          }}
                          className="px-5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          + Add Table
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* TABLE AREA */}
                {section.tables && section.tables.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
                    {section.tables.map((table) => (
                      <TableCard
                        key={table.id}
                        table={table}
                        mergeMode={isActive}
                        selectedTables={selectedTables}
                        toggleTableSelection={toggleTableSelection}
                        isTableSelectableForMerge={canSelectForMerge}
                        onUpdate={(t) => {
                          setSelectedTable(t);
                          setSelectedSectionId(section.id);
                          setShowTableModal(true);
                        }}
                        handleSplitTable={handleSplitTable}
                        onChangeTable={(t) => {
                          setTableToMove(t);
                          setShowChangeTableModal(true);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  /* ===== NO TABLES IN SECTION ===== */
                  <div className="py-10">
                    <NoDataFound
                      title="No Tables Found"
                      description="Add a table to this section"
                    />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          /* ================= NO SECTIONS ================= */
          <NoDataFound
            title="No Sections Found"
            description="Create a section to get started"
          />
        )}
      </div>

      {mergeMode && selectedTables.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-lg border border-slate-200 shadow-2xl rounded-2xl px-8 py-4 flex items-center gap-6 z-50">
          <span className="text-sm font-semibold text-slate-700">
            {selectedTables.length} Tables Selected
          </span>

          {/* RIGHT ACTION */}
          <button
            onClick={handleMergeTables}
            disabled={selectedTables.length < 2 || isMergingTable}
            className="btn bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700"
          >
            {isMergingTable && <Loader2 className="h-4 w-4 animate-spin" />}
            {isMergingTable ? "Merging..." : "Confirm Merge"}
          </button>
        </div>
      )}

      <SectionModal
        isOpen={showSectionModal}
        onClose={resetModals}
        onSubmit={handleSectionSubmit}
        floorId={floorId}
        outletId={outletId}
        section={selectedSection}
        loading={isCreatingSections || isUpdatingSections}
      />

      <TableModal
        isOpen={showTableModal}
        onClose={resetModals}
        outletId={outletId}
        floorId={floorId}
        sectionId={selectedSectionId}
        table={selectedTable}
        onSubmit={handleTableSubmit}
        loading={isCreatingTable || isUpdatingTable}
      />

      <ChangeTableModal
        isOpen={showChangeTableModal}
        onClose={() => {
          setShowChangeTableModal(false);
          setTableToMove(null);
        }}
        tableToMove={tableToMove}
        sections={sections}
        onConfirm={handleChangeTable}
      />
    </>
  );
};

export default AllTablesPage;
