import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadTransactionInvoice,
  fetchAllTransactions,
} from "../../redux/slices/transactionSlice";
import { formatDate } from "../../utils/dateFormatter";
import { formatText } from "../../utils/utils";
import { formatNumber } from "../../utils/numberFormatter";
import SmartTable from "../../components/SmartTable";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import Pagination from "../../components/Pagination";
import { Download, Eye, RotateCcw } from "lucide-react";
import SearchBar from "../../components/SearchBar";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/paths";
import { handleResponse } from "../../utils/helpers";
import { downloadBlob } from "../../utils/blob";

const AllTransactionsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState();

  const { isFetchingTransactions, allTransactions, invoiceToDownloadId } =
    useSelector((state) => state.transaction);

  const { summary, transactions, pagination } = allTransactions || {};

  const fetchTransactions = () => {
    dispatch(
      fetchAllTransactions({
        page: currentPage,
        limit: itemsPerPage,
        search,
        dateRange,
      }),
    );
  };

  useEffect(() => {
    if (!dateRange) return;
    fetchTransactions();
  }, [currentPage, itemsPerPage, search, dateRange]);

  const columns = [
    {
      key: "invoice",
      label: "Invoice / Payment",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">#{row.id}</span>

          <span className="text-[11px] text-slate-400 mt-0.5">
            Order: {row.razorpayOrderId}
          </span>

          <span className="text-[10px] text-slate-400">
            Payment: {row.razorpayPaymentId}
          </span>
        </div>
      ),
    },

    {
      key: "outlet",
      label: "Outlet",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">
            {row.outlet?.name}
          </span>

          <span className="text-[11px] text-slate-400 mt-0.5">
            {row.outlet?.code}
          </span>

          <span className="text-[10px] text-slate-400">
            {row.outlet?.city}, {row.outlet?.state}
          </span>
        </div>
      ),
    },

    {
      key: "subscriptionId",
      label: "Subscription",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[13px] font-semibold text-slate-700">
            Plan #{row.subscriptionId}
          </span>

          <span className="text-[10px] text-slate-400">
            GSTIN: {row.outlet?.gstin || "-"}
          </span>
        </div>
      ),
    },

    {
      key: "amounts",
      label: "Amount Details",
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-[12px] text-slate-700">
            Base:{" "}
            <span className="font-semibold">
              {formatNumber(row.baseAmount, true)}
            </span>
          </span>

          <span className="text-[12px] text-slate-700">
            GST:{" "}
            <span className="font-semibold">
              {formatNumber(row.gstAmount, true)}
            </span>
          </span>

          <span className="text-[13px] font-bold text-emerald-600">
            Total: {formatNumber(row.totalAmount, true)}
          </span>
        </div>
      ),
    },

    {
      key: "status",
      label: "Status",
      render: (row) => (
        <div className="flex flex-col">
          <span
            className={`inline-flex w-fit text-[10px] font-bold px-2 py-0.5 rounded-full border
            ${
              row.status === "captured"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {formatText(row.status)}
          </span>

          <span className="text-[10px] text-slate-400 mt-1">
            via {formatText(row.paymentMethod)}
          </span>
        </div>
      ),
    },

    {
      key: "paidAt",
      label: "Payment Date",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-semibold text-slate-700">
            {formatDate(row.paidAt, "long")}
          </span>

          <span className="text-[10px] text-slate-400 mt-0.5">
            {formatDate(row.paidAt, "time")}
          </span>
        </div>
      ),
    },

    {
      key: "createdAt",
      label: "Created",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-semibold text-slate-700">
            {formatDate(row.createdAt, "long")}
          </span>

          <span className="text-[10px] text-slate-400">
            Updated: {formatDate(row.updatedAt, "time")}
          </span>
        </div>
      ),
    },
  ];

  const handleDownloadInvoice = async (data) => {
    const fileName = `INV_SUB_${data.id}`;

    await handleResponse(
      dispatch(downloadTransactionInvoice({ transactionId: data.id })),
      (res) => {
        downloadBlob({
          data: res.payload,
          fileName: fileName,
        });
      },
    );
  };

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) =>
        navigate(`${ROUTE_PATHS.TRANSACTION_DETAILS}?transactionId=${row.id}`),
    },

    {
      label: "Download",
      icon: Download,
      color: "emerald",
      onClick: (row) => handleDownloadInvoice(row),
      loading: (row) => row.id === invoiceToDownloadId,
      disabled: invoiceToDownloadId,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={"All Transactions"}
        showBackButton
        rightContent={
          <CustomDateRangePicker value={dateRange} onChange={setDateRange} />
        }
        onRefresh={fetchTransactions}
        isRefreshing={isFetchingTransactions}
      />

      <SearchBar onSearch={(v) => setSearch(v)} />

      <SmartTable
        title="Transactions"
        totalcount={pagination?.total}
        data={transactions}
        columns={columns}
        actions={rowActions}
        loading={isFetchingTransactions}
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

export default AllTransactionsPage;
