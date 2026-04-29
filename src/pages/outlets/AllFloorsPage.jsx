import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  createFloor,
  fetchAllFloors,
  updateFloor,
} from "../../redux/slices/floorSlice";
import SmartTable from "../../components/SmartTable";
import {
  ArrowUpDown,
  Edit2,
  Edit3,
  Eye,
  Hash,
  Layers,
  LayoutGrid,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FloorModal from "../../partial/floor/FloorModal";
import { handleResponse } from "../../utils/helpers";
import { formatDate } from "../../utils/dateFormatter";
import StatusBadge from "../../layout/StatusBadge";
import { ROUTE_PATHS } from "../../config/paths";

const AllFloorsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { outletId } = useSelector((state) => state.auth);
  const { allFloors, loading, isCreatingFloor, isUpdatingFloor } = useSelector(
    (state) => state.floor,
  );

  const [showFloorModal, setShowFloorModal] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);

  const fetchFloors = () => {
    dispatch(fetchAllFloors(outletId));
  };

  useEffect(() => {
    fetchFloors();
  }, [outletId]);

  const columns = [
    /* ==============================
     FLOOR INFO (Primary Column)
  ============================== */
    {
      key: "name",
      label: "Floor",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col gap-1 min-w-[240px]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-900">{row.name}</span>
          </div>

          {row.description && (
            <span
              title={row.description}
              className="text-xs text-slate-500 line-clamp-1"
            >
              {row.description}
            </span>
          )}

          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
            <Hash className="w-3 h-3" />
            Floor #{row.floor_number}
          </div>
        </div>
      ),
    },

    /* ==============================
     META INFO (Code + Order)
  ============================== */
    {
      key: "meta",
      label: "Details",
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
            {row.code}
          </span>

          <span className="px-2 py-1 rounded-md border border-slate-200 text-slate-600 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" />
            {row.display_order}
          </span>
        </div>
      ),
    },

    /* ==============================
     TABLE SUMMARY
  ============================== */
    {
      key: "tables",
      label: "Tables",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-6 text-sm">
          {/* Total */}
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-indigo-400" />
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-slate-900">
                {row.table_count ?? 0}
              </span>
              <span className="text-[11px] text-slate-400">Total</span>
            </div>
          </div>

          {/* Available */}
          <div className="flex flex-col leading-tight">
            <span className="font-medium text-emerald-600">
              {row.available_count ?? 0}
            </span>
            <span className="text-[11px] text-slate-400">Available</span>
          </div>

          {/* Occupied */}
          <div className="flex flex-col leading-tight">
            <span className="font-medium text-rose-600">
              {row.occupied_count ?? 0}
            </span>
            <span className="text-[11px] text-slate-400">Occupied</span>
          </div>
        </div>
      ),
    },

    /* ==============================
     STATUS
  ============================== */
    {
      key: "is_active",
      label: "Status",
      sortable: true,
      render: (row) => <StatusBadge value={row.is_active} />,
    },

    /* ==============================
     LAST UPDATED
  ============================== */
    {
      key: "updated_at",
      label: "Last Updated",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {formatDate(row.updated_at, "longTime")}
        </span>
      ),
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) =>
        navigate(`${ROUTE_PATHS.FLOORS_TABLES}?floorId=${row.id}`),
    },
    {
      label: "Edit",
      icon: Edit2,
      onClick: (row) => {
        (setSelectedFloor(row), setShowFloorModal(true));
      },
      color: "blue",
    },
  ];

  const resetFloorStates = () => {
    setShowFloorModal(false);
    setSelectedFloor(null);
  };

  const handleAddFloor = async ({ id, values, resetForm }) => {
    const action = id ? updateFloor({ id, values }) : createFloor(values);
    await handleResponse(dispatch(action), () => {
      fetchFloors();
      resetFloorStates();
      resetForm();
    });
  };

  const actions = [
    {
      label: "Add New Floor",
      type: "primary",
      icon: Plus,
      onClick: () => setShowFloorModal(true),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <PageHeader title={"All Floors"} actions={actions} />

        <SmartTable
          title="Floors"
          totalcount={allFloors?.length}
          data={allFloors}
          columns={columns}
          actions={rowActions}
          loading={loading}
        />
      </div>

      <FloorModal
        isOpen={showFloorModal}
        onClose={resetFloorStates}
        onSubmit={handleAddFloor}
        outletId={outletId}
        floor={selectedFloor}
        loading={isCreatingFloor || isUpdatingFloor}
      />
    </>
  );
};

export default AllFloorsPage;
