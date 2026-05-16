import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadAllTableQr,
  downloadTableQr,
  fetchAllTableQr,
  generateAllTableQr,
  generateSingleTableQr,
} from "../../redux/slices/qrSlice";
import { QrCode, Download, Wand2, DownloadIcon } from "lucide-react";
import StatusBadge from "../../layout/StatusBadge";
import NoDataFound from "../../layout/NoDataFound";
import { handleResponse } from "../../utils/helpers";
import { downloadBlob } from "../../utils/blob";
import GenerateSingleTableQrModal from "../table-qr/GenerateSingleTableQrModal";
import GenerateAllTableQrModal from "../table-qr/GenerateAllTableQrModal";
import TableQrCard from "../table-qr/TableQrCard";
import TableQrCardSkeleton from "../table-qr/TableQrCardSkeleton";

const BASE_URL = window.location.origin;

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const TablesQrPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((s) => s.auth);
  const {
    isFetchingAllTableQr,
    allTablesQr,
    isGeneratingSingleQr,
    generatedQr,
    isGeneratingBulkQr,
    allQrGenerated,
    isDownloadingAllQr,
    tableQrToDownload,
  } = useSelector((s) => s.qr);

  // Single modal state
  const [modalState, setModalState] = useState({
    type: null, // null | 'single' | 'bulk'
    table: null,
  });

  const fetchQr = () => {
    dispatch(fetchAllTableQr({ outletId }));
  };

  useEffect(() => {
    if (!outletId) return;
    fetchQr();
  }, [outletId]);

  // Handlers
  const handleGenerateSingle = async () => {
    // Dispatch your API call here
    const values = {
      outletId,
      tableId: modalState.table?.tableId,
      baseUrl: BASE_URL,
    };

    await handleResponse(dispatch(generateSingleTableQr({ values })), () => {
      fetchQr();
      setModalState({
        type: null,
        table: null,
      });
    });
  };

  const handleGenerateAll = async () => {
    // Dispatch your API call here
    const values = {
      outletId,
      baseUrl: BASE_URL,
    };

    await handleResponse(dispatch(generateAllTableQr({ values })), () => {
      fetchQr();
      setModalState({
        type: null,
        table: null,
      });
    });
  };

  const handleCloseModal = () => {
    setModalState({ type: null, table: null });
  };

  const handleOpenSingleModal = (table) => {
    setModalState({ type: "single", table });
  };

  const handleOpenBulkModal = () => {
    setModalState({ type: "bulk", table: null });
  };

  const handleDonloadAllQr = async () => {
    const fileName = `table-qr-codes-${outletId}`;
    await handleResponse(dispatch(downloadAllTableQr({ outletId })), (res) => {
      downloadBlob({ data: res.payload, fileName });
    });
  };

  const handleDownloadSingleQr = async ({ table }) => {
    const fileName = `table-qr-${table?.tableNumber}`;

    await handleResponse(
      dispatch(downloadTableQr({ outletId, tableId: table.tableId })),
      (res) => {
        downloadBlob({ data: res.payload, fileName });
      },
    );
  };

  const floors = allTablesQr?.floors ?? [];
  const allTables = floors.flatMap((f) => f.tables ?? []);

  const actions = [
    {
      label: "Generate for All",
      type: "primary",
      icon: Wand2,
      onClick: handleOpenBulkModal,
      loading: isGeneratingBulkQr,
      loadingText: "Refreshing...",
    },
    {
      label: "Download All",
      type: "export",
      icon: DownloadIcon,
      onClick: handleDonloadAllQr,
      loading: isDownloadingAllQr,
      loadingText: "Downloading...",
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="Tables QR"
          actions={actions}
          onRefresh={fetchQr}
          isRefreshing={isFetchingAllTableQr}
        />

        {/* Content */}
        {isFetchingAllTableQr ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, index) => (
              <TableQrCardSkeleton key={index} />
            ))}
          </div>
        ) : floors.length === 0 ? (
          <NoDataFound
            icon={QrCode}
            title="No tables found"
            description="Tables will appear here once added to your outlet"
          />
        ) : (
          <div className="space-y-10">
            {floors.map((floor) => (
              <section key={floor.floorId}>
                {/* Floor label */}
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    {floor.floorName}
                  </p>
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
                    {(floor.tables ?? []).length} tables
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {(floor.tables ?? []).map((table) => (
                    <TableQrCard
                      key={table.tableId}
                      table={table}
                      onDownload={handleDownloadSingleQr}
                      tableQrToDownload={tableQrToDownload}
                      onGenerate={handleOpenSingleModal}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* Single QR Modal */}
      <GenerateSingleTableQrModal
        isOpen={modalState.type === "single"}
        onClose={handleCloseModal}
        table={modalState.table}
        outletId={outletId}
        baseUrl={BASE_URL}
        loading={isGeneratingSingleQr}
        onGenerate={handleGenerateSingle}
      />

      {/* Generate All QR Modal */}
      <GenerateAllTableQrModal
        isOpen={modalState.type === "bulk"}
        onClose={handleCloseModal}
        total={allTables.length}
        baseUrl={BASE_URL}
        loading={isGeneratingBulkQr}
        onGenerate={handleGenerateAll}
      />
    </>
  );
};

export default TablesQrPage;
