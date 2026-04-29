import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  createUnit,
  fetchAllUnits,
  updateUnit,
} from "../../redux/slices/unitSlice";
import SmartTable from "../../components/SmartTable";
import { Plus } from "lucide-react";
import UnitModal from "../../partial/inventory/unit/UnitModal";
import { handleResponse } from "../../utils/helpers";

const AllUnitsPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { isFetchingUnits, allUnits, isCreatingUnit, isUpdatingUnit } =
    useSelector((state) => state.unit);
  const { units, pagination } = allUnits || {};

  const [showUnitModal, setShowUnitModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(false);

  const fetchUnits = () => {
    if (!outletId) return;
    dispatch(fetchAllUnits(outletId));
  };
    
  useEffect(() => {
    fetchUnits();
  }, [outletId]);

  const columns = [
    {
      key: "name",
      label: "Unit Name",
      render: (row) => (
        <span className="font-semibold text-slate-800">{row.name}</span>
      ),
    },

    {
      key: "abbreviation",
      label: "Abbr",
      render: (row) => (
        <span className="px-2 py-0.5 text-xs rounded-md bg-slate-100 text-slate-700 font-medium uppercase">
          {row.abbreviation}
        </span>
      ),
    },

    {
      key: "unitType",
      label: "Type",
      render: (row) => (
        <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-700 capitalize">
          {row.unitType}
        </span>
      ),
    },

    {
      key: "conversionFactor",
      label: "Conversion",
      sortValue: (row) => Number(row.conversionFactor),
      render: (row) => (
        <span className="text-slate-700 font-medium">
          {row.conversionFactor}
        </span>
      ),
    },

    // {
    //   key: "isBaseUnit",
    //   label: "Base Unit",
    //   sortValue: (row) => Number(row.isBaseUnit),
    //   render: (row) => (
    //     <span
    //       className={`px-2 py-0.5 text-xs rounded-full font-medium ${
    //         row.isBaseUnit
    //           ? "bg-emerald-100 text-emerald-700"
    //           : "bg-slate-100 text-slate-500"
    //       }`}
    //     >
    //       {row.isBaseUnit ? "Base" : "Derived"}
    //     </span>
    //   ),
    // },

    // {
    //   key: "status",
    //   label: "Status",
    //   sortable: true,
    //   sortValue: (row) => Number(row.isActive),
    //   render: (row) => (
    //     <div className="w-fit">
    //       <StatusBadge value={Number(row.isActive)} />
    //     </div>
    //   ),
    // },
  ];

  const actions = [
    {
      label: "Add New Unit",
      type: "primary",
      icon: Plus,
      onClick: () => setShowUnitModal(true),
    },
  ];

  const resetUnitModal = () => {
    setShowUnitModal(false);
    setSelectedUnit(false);
  };

  const handleCreateUnit = async ({ id, values, resetForm }) => {
    const action = id
      ? updateUnit({ id, values })
      : createUnit({ outletId, values });
    await handleResponse(dispatch(action), () => {
      fetchUnits();
      resetUnitModal();
      resetForm();
    });
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader title={"All Units"} actions={actions} />

        <SmartTable
          title="Units"
          totalcount={units?.length}
          data={units}
          columns={columns}
          // actions={rowActions}
          loading={isFetchingUnits}
        />
      </div>

      <UnitModal
        isOpen={showUnitModal}
        onClose={resetUnitModal}
        onSubmit={handleCreateUnit}
        unit={selectedUnit}
        loading={isCreatingUnit || isUpdatingUnit}
        units={units}
      />
    </>
  );
};

export default AllUnitsPage;
