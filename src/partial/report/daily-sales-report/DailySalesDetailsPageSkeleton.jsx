import React from "react";
import Shimmer from "../../../layout/Shimmer";

export default function DailySalesDetailsPageSkeleton() {
  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shimmer width="36px" height="36px" rounded="lg" />
          <Shimmer width="260px" height="20px" />
        </div>

        <Shimmer width="120px" height="36px" rounded="lg" />
      </div>

      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-3">
            <Shimmer width="40px" height="40px" rounded="lg" />

            <div className="space-y-2">
              <Shimmer width="120px" height="10px" />
              <Shimmer width="220px" height="16px" />
              <Shimmer width="180px" height="10px" />
            </div>
          </div>

          {/* Right */}
          <div className="text-right space-y-2">
            <Shimmer width="80px" height="10px" />
            <Shimmer width="120px" height="26px" />
            <Shimmer width="100px" height="10px" />
          </div>
        </div>

        {/* Metric strip */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/40"
            >
              <Shimmer width="18px" height="18px" rounded="full" />

              <div className="flex flex-col gap-1">
                <Shimmer width="50px" height="8px" />
                <Shimmer width="60px" height="12px" />
                <Shimmer width="70px" height="8px" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>

      {/* Payment + Order Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricPanelSkeleton rows={5} />
        <MetricPanelSkeleton rows={4} />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <Shimmer width="120px" height="14px" />
          <Shimmer width="60px" height="10px" />
        </div>

        <div className="divide-y">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-4 py-3">
              <Shimmer width="120px" height="12px" />
              <Shimmer width="80px" height="12px" />
              <Shimmer width="100px" height="12px" />
              <Shimmer width="70px" height="12px" />
              <Shimmer width="60px" height="12px" />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Shimmer width="160px" height="12px" />
        <div className="flex gap-2">
          <Shimmer width="32px" height="32px" rounded="md" />
          <Shimmer width="32px" height="32px" rounded="md" />
          <Shimmer width="32px" height="32px" rounded="md" />
        </div>
      </div>
    </div>
  );
}

/* KPI Card Skeleton */
function StatSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="flex justify-between mb-3">
        <Shimmer width="80px" height="10px" />
        <Shimmer width="24px" height="24px" rounded="full" />
      </div>

      <Shimmer width="100px" height="18px" />

      <div className="mt-2">
        <Shimmer width="90px" height="10px" />
      </div>
    </div>
  );
}

/* Metric Panel Skeleton */
function MetricPanelSkeleton({ rows }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4">
      <div className="flex justify-between items-center">
        <Shimmer width="120px" height="12px" />
        <Shimmer width="80px" height="12px" />
      </div>

      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <Shimmer width="90px" height="10px" />
          <Shimmer width="120px" height="8px" />
        </div>
      ))}
    </div>
  );
}