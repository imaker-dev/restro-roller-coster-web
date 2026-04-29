import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchItemBatches } from "../../redux/slices/itemBatchSlice";
import { useQueryParams } from "../../hooks/useQueryParams";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber } from "../../utils/numberFormatter";
import SmartTable from "../../components/SmartTable";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { ROUTE_PATHS } from "../../config/paths";

const InventoryItemBatches = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { itemId } = useQueryParams();
  const { isFetchingItemBatches, itemBatchData } = useSelector(
    (state) => state.itemBatch,
  );
  const { batches, pagination } = itemBatchData || {};

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (itemId) {
      dispatch(
        fetchItemBatches({ itemId, page: currentPage, limit: itemsPerPage }),
      );
    }
  }, [itemId, currentPage, itemsPerPage]);

  const columns = [
    {
      key: "batchCode",
      label: "Batch",
      render: (row) => (
        <div className="flex flex-col min-w-0">
          <p className="text-xs font-extrabold text-slate-800 truncate">
            {row.batchCode}
          </p>

          <p className="text-[10px] text-slate-400 font-medium">#{row.id}</p>
        </div>
      ),
    },

    {
      key: "vendor",
      label: "Vendor",
      render: (row) => (
        <div className="flex items-center gap-2 min-w-0">
          {/* Avatar */}
          <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-600">
            {row.vendorName?.charAt(0) || "V"}
          </div>

          <p className="text-xs font-semibold text-slate-800 truncate">
            {row.vendorName}
          </p>
        </div>
      ),
    },

    {
      key: "quantity",
      label: "Stock",
      render: (row) => {
        const isLow = row.remainingQuantity <= 2;

        return (
          <div className="flex flex-col">
            <p className="text-sm font-extrabold text-slate-900 tabular-nums">
              {row.remainingQuantity}{" "}
              <span className="text-[10px] text-slate-400">
                / {row.quantity} {row.unitAbbreviation}
              </span>
            </p>

            {isLow && (
              <p className="text-[10px] text-red-500 font-semibold">
                Low stock
              </p>
            )}
          </div>
        );
      },
    },

    {
      key: "price",
      label: "Purchase",
      render: (row) => (
        <div className="flex flex-col">
          <p className="text-sm font-bold text-slate-800">
            ₹{formatNumber(row.purchasePrice)}
          </p>

          <p className="text-[10px] text-slate-400">
            per {row.unitAbbreviation}
          </p>
        </div>
      ),
    },

    {
      key: "dates",
      label: "Dates",
      render: (row) => (
        <div className="flex flex-col">
          <p className="text-[11px] font-semibold text-slate-700">
            {formatDate(row.purchaseDate, "long")}
          </p>

          {row.expiryDate ? (
            <p className="text-[10px] text-slate-400">
              Exp: {formatDate(row.expiryDate, "long")}
            </p>
          ) : (
            <p className="text-[10px] text-slate-400">No expiry</p>
          )}
        </div>
      ),
    },

    {
      key: "created",
      label: "Created",
      render: (row) => (
        <div className="flex flex-col">
          <p className="text-[11px] text-slate-600 font-medium">
            {formatDate(row.createdAt, "long")}
          </p>

          <p className="text-[10px] text-slate-400">
            {formatDate(row.createdAt, "time")}
          </p>
        </div>
      ),
    },
  ];

  const rowActions = [
    {
      label: "Eye",
      icon: Eye,
      onClick: (row) =>
        navigate(`${ROUTE_PATHS.PURCHASE_ORDERS_DETAILS}?purchaseId=${row.id}`),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={"Item Batches"} showBackButton />

      <SmartTable
        title="Items Batches"
        totalcount={pagination?.total}
        data={batches}
        columns={columns}
        actions={rowActions}
        loading={isFetchingItemBatches}
      />

      <Pagination
        totalItems={pagination?.total}
        currentPage={currentPage}
        pageSize={itemsPerPage}
        totalPages={pagination?.totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        maxPageNumbers={5}
        showPageSizeSelector={true}
        onPageSizeChange={(size) => {
          setCurrentPage(1);
          setItemsPerPage(size);
        }}
      />
    </div>
  );
};

export default InventoryItemBatches;
