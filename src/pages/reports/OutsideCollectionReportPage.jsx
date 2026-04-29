import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOutsideCollection } from "../../redux/slices/outsideCollectionSlice";
import { useReportDateRange } from "../../hooks/useReportDateRange";
import PageHeader from "../../layout/PageHeader";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import { Calendar, User, Hash, FileText } from "lucide-react";
import { formatNumber } from "../../utils/numberFormatter";
import { formatDate } from "../../utils/dateFormatter";
import PaymentBar from "../../partial/report/PaymentBreakdownBar";
import PaymentTypeBadge from "../../partial/order/PaymentTypeBadge";
import NoDataFound from "../../layout/NoDataFound";
import Shimmer from "../../layout/Shimmer";

/* ── helpers ── */
const fmt = (n) => formatNumber(n, true);

function CollectionCard({ item }) {
  const isCancelled = item.status === "cancelled";
  return (
    <div
      className={`rounded-2xl border overflow-hidden ${isCancelled ? "bg-red-50/40 border-red-100" : "bg-white border-gray-100"}`}
    >
      {/* card header */}
      <div className="flex items-start justify-between gap-3 px-4 pt-3.5 pb-3 border-b border-gray-50">
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900">{item.reason}</p>
          {item.description && (
            <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
          )}
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {/* <StatusPill status={item.status} /> */}
            <PaymentTypeBadge type={item.paymentMode} size="sm" />
          </div>
        </div>
        <div className="text-right shrink-0">
          <p
            className={`text-base font-bold ${isCancelled ? "text-red-400 line-through" : "text-gray-900"}`}
          >
            {fmt(item.amount)}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">#{item.id}</p>
        </div>
      </div>

      {/* card footer */}
      <div className="flex items-center justify-between px-4 py-2.5 gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <User size={11} className="text-gray-400 shrink-0" />
          <span className="text-[10px] text-gray-500">
            {item.collectedByName}
          </span>
        </div>
        {item.floorName && (
          <div className="flex items-center gap-1.5">
            <Hash size={11} className="text-gray-400 shrink-0" />
            <span className="text-[10px] text-gray-500">{item.floorName}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 ml-auto">
          <Calendar size={11} className="text-gray-400 shrink-0" />
          <span className="text-[10px] text-gray-400">
            {formatDate(item.createdAt, "longTime")}
          </span>
        </div>
      </div>

      {/* cancelled info */}
      {isCancelled && (
        <div className="mx-4 mb-3 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          <p className="text-[10px] font-semibold text-red-500">
            Cancelled by {item.cancelledByName} ·{" "}
            {formatDate(item.cancelledAt, "longTime")}
          </p>
          {item.cancelReason && (
            <p className="text-[10px] text-red-400 mt-0.5">
              {item.cancelReason}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── main page ── */
const OutsideCollectionReportPage = () => {
  const dispatch = useDispatch();
  const { dateRange, setDateRange } = useReportDateRange();
  const { outletId } = useSelector((s) => s.auth);
  const { isFetchingOutsideCollection, outsideCollections } = useSelector(
    (s) => s.outsideCollection,
  );

  useEffect(() => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;
    dispatch(fetchAllOutsideCollection({ outletId, dateRange }));
  }, [outletId, dateRange]);

  const { collections, summary, pagination } = outsideCollections || {};

  return (
    <div className="space-y-6">
      <PageHeader
        title="Outside Collection Report"
        showBackButton
        rightContent={
          <CustomDateRangePicker value={dateRange} onChange={setDateRange} />
        }
      />

      {/* body */}
      {!outsideCollections && !isFetchingOutsideCollection ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Calendar size={20} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-500">
            Select a date range to get started
          </p>
          <p className="text-xs text-gray-400">
            Your outside collections will appear here
          </p>
        </div>
      ) : isFetchingOutsideCollection ? (
        <div className="space-y-2">
          {/* ── Collection Cards ── */}
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white overflow-hidden"
            >
              {/* header */}
              <div className="px-4 pt-3.5 pb-3 border-b border-gray-50 flex justify-between">
                <div className="space-y-2 w-2/3">
                  <Shimmer width="120px" height="12px" />
                  <Shimmer width="160px" height="10px" />
                  <Shimmer width="80px" height="18px" rounded="full" />
                </div>
                <div className="text-right space-y-2">
                  <Shimmer width="80px" height="14px" />
                  <Shimmer width="40px" height="10px" />
                </div>
              </div>

              {/* footer */}
              <div className="px-4 py-2.5 flex justify-between">
                <Shimmer width="100px" height="10px" />
                <Shimmer width="60px" height="10px" />
                <Shimmer width="120px" height="10px" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* ── summary ── */}
          {summary && (
            <div className="space-y-4">
              {/* payment breakdown */}
              {summary.paymentBreakdown && (
                <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                      Payment breakdown
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatNumber(summary?.totalAmount, true)} total
                    </p>
                  </div>
                  {Object.entries(summary.paymentBreakdown)
                    .filter(([, v]) => v > 0)
                    .map(([mode, amount]) => (
                      <PaymentBar
                        key={mode}
                        type={mode}
                        amount={amount}
                        total={summary.totalAmount}
                      />
                    ))}
                </div>
              )}
            </div>
          )}

          {/* ── collection list ── */}
          {collections?.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-0.5">
                <div className="flex items-center gap-2">
                  <FileText size={13} className="text-gray-400" />
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Entries
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  {pagination?.total} total
                </p>
              </div>
              {[...collections]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((item) => (
                  <CollectionCard key={item.id} item={item} />
                ))}
            </div>
          ) : (
            <NoDataFound
              icon={FileText}
              title="No collections found for this period"
              className="bg-white border border-gray-100 rounded-2xl"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default OutsideCollectionReportPage;
