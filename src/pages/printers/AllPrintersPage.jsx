import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  createPrinter,
  fetchAllPrinters,
  testPrinter,
  updatePrinter,
} from "../../redux/slices/printerSlice";
import SmartTable from "../../components/SmartTable";
import StatusBadge from "../../layout/StatusBadge";
import { formatDate } from "../../utils/dateFormatter";
import { Edit2, Plus, Printer, RotateCcw, Wifi, WifiOff } from "lucide-react";
import PrinterModal from "../../partial/printers/PrinterModal";
import { handleResponse } from "../../utils/helpers";
import { fetchAllStations } from "../../redux/slices/stationSlice";
import StatCard from "../../components/StatCard";
import { formatText } from "../../utils/utils";

const AllPrintersPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const {
    allPrinters,
    loading,
    printerTestingId,
    isCreatingPrinter,
    isUpdatingPrinter,
  } = useSelector((state) => state.printer);
  const { summary, printers } = allPrinters || {};

  const { allStations } = useSelector((state) => state.station);

  const [showPrinterModal, setShowPrinterModal] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState(null);

  const fetchPrinters = () => {
    dispatch(fetchAllPrinters(outletId));
  };

  useEffect(() => {
    if (outletId) {
      fetchPrinters();
    }
    if (!allStations) {
      dispatch(fetchAllStations(outletId));
    }
  }, [outletId]);

  const handlePrintTest = (row) => {
    dispatch(
      testPrinter({ outletId, station: row?.station, printerId: row.id }),
    );
  };

  const columns = [
    {
      key: "printer",
      label: "Printer",
      render: (row) => (
        <div className="flex flex-col max-w-[240px]">
          <span className="font-semibold text-slate-800 truncate">
            {row.name}
          </span>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-mono">
              {row.ipAddress}:{row.port}
            </span>
            <span>•</span>
            <span className="capitalize">{row.printerType}</span>
          </div>
        </div>
      ),
    },

    {
      key: "station",
      label: "Assigned Station",
      render: (row) => {
        // New API field
        const station = row.assignedStation;

        if (!station) {
          return (
            <span className="text-slate-400 italic text-sm">Unassigned</span>
          );
        }

        return (
          <div className="flex flex-col max-w-[200px]">
            <span className="text-sm font-medium text-slate-700 truncate">
              {station.name}
            </span>
            {/* <span className="text-xs text-slate-400 font-mono">
              {station.code}
            </span> */}
          </div>
        );
      },
    },

    {
      key: "connection",
      label: "Connection",
      render: (row) => (
        <div className="flex flex-col">
          <div className="w-fit">
            <StatusBadge
              value={Boolean(row.isOnline)}
              trueText="Online"
              falseText="Offline"
            />
          </div>

          {row.isOnline && row.latency && (
            <span className="text-xs text-emerald-600 mt-1">{row.latency}</span>
          )}

          {!row.isOnline && row.error && (
            <span className="text-xs text-red-500 mt-1 truncate max-w-[180px]">
              {row.error}
            </span>
          )}
        </div>
      ),
    },

    {
      key: "isActive",
      label: "Status",
      render: (row) => (
        <StatusBadge
          value={Boolean(row.isActive)}
          trueText="Active"
          falseText="Inactive"
        />
      ),
    },
  ];

  const rowActions = [
    {
      label: "Update",
      icon: Edit2,
      color: "blue",
      onClick: (row) => {
        (setSelectedPrinter(row), setShowPrinterModal(true));
      },
    },
    {
      label: "Print Test",
      icon: Printer,
      color: "green",
      onClick: (row) => {
        handlePrintTest(row);
      },
      loading: (row) => row.id === printerTestingId,
    },
  ];

  const actions = [
    {
      label: "Add Printer",
      type: "primary",
      icon: Plus,
      onClick: () => setShowPrinterModal(true),
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchPrinters,
      loading: loading,
      loadingText: "Refreshing...",
    },
  ];

  const clearPrinterStates = () => {
    setShowPrinterModal(false);
    setSelectedPrinter(null);
  };

  const handleAddPrinter = async ({ id, values, resetForm }) => {
    const action = id
      ? updatePrinter({ id, values, resetForm })
      : createPrinter(values);

    await handleResponse(dispatch(action), () => {
      clearPrinterStates();
      fetchPrinters();
      resetForm();
    });
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader title={"All Printers"} actions={actions} />

        <SmartTable
          title="Printers"
          totalcount={printers?.length}
          data={printers}
          columns={columns}
          actions={rowActions}
          loading={loading}
        />
      </div>
      <PrinterModal
        isOpen={showPrinterModal}
        onClose={clearPrinterStates}
        onSubmit={handleAddPrinter}
        outletId={outletId}
        printer={selectedPrinter}
        stations={allStations}
        loading={isCreatingPrinter || isUpdatingPrinter}
      />
    </>
  );
};

export default AllPrintersPage;
