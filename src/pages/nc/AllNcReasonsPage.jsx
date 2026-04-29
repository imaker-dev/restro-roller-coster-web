import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  createNcReason,
  fetchNcReasons,
  updateNcReason,
} from "../../redux/slices/ncSlice";
import { Edit3, Plus } from "lucide-react";
import AddNcReasonModal from "../../partial/nc/AddNcReasonModal";
import { handleResponse } from "../../utils/helpers";
import StatusBadge from "../../layout/StatusBadge";
import SmartTable from "../../components/SmartTable";

const AllNcReasonsPage = () => {
  const dispatch = useDispatch();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);

  const { outletId } = useSelector((state) => state.auth);
  const { ncReasons, loading, isCreatingNcReason } = useSelector(
    (state) => state.nc,
  );

  const fetchReasons = () => {
    dispatch(fetchNcReasons(outletId));
  };

  useEffect(() => {
    if (outletId) {
      fetchReasons();
    }
  }, [outletId]);

  const actions = [
    {
      label: "Add Reason",
      icon: Plus,
      type: "primary",
      onClick: () => setShowAddModal(true),
    },
  ];

  const columns = [
    {
      key: "name",
      label: "Title",
      sortable: true,
      render: (row) => (
        <span className="text-slate-800 font-semibold truncate">
          {row.name}
        </span>
      ),
    },

    {
      key: "description",
      label: "Description",
      sortable: false,
      render: (row) => (
        <span className="text-sm text-slate-600 truncate max-w-[320px] block">
          {row.description || "No description"}
        </span>
      ),
    },

    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (row) => <StatusBadge value={row.isActive} />,
    },
  ];

  const rowActions = [
    {
      label: "Edit",
      icon: Edit3,
      color: "blue",
      onClick: (row) => {
        (setShowAddModal(true), setSelectedReason(row));
      },
    },
  ];

  const clearNcStates = () => {
    setShowAddModal(false);
    setSelectedReason(null);
  };

  const handleAddReason = async ({ id, values, resetForm }) => {
    const action = id
      ? updateNcReason({ outletId, id, values })
      : createNcReason({ outletId, values });
    await handleResponse(dispatch(action), () => {
      fetchReasons();
      clearNcStates();
      resetForm();
    });
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader title="NC (No Charge) Reasons" actions={actions} />

        <SmartTable
          title="Reasons"
          totalcount={ncReasons?.length}
          data={ncReasons}
          columns={columns}
          actions={rowActions}
          loading={loading}
        />
      </div>
      <AddNcReasonModal
        isOpen={showAddModal}
        onClose={clearNcStates}
        onSubmit={handleAddReason}
        reason={selectedReason}
        loading={isCreatingNcReason}
      />
    </>
  );
};

export default AllNcReasonsPage;
