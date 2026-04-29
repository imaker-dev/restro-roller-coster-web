import {
  CheckCircle2,
  Layers,
  Loader2,
  PackagePlus,
  Plus,
  PlusCircle,
  RotateCcw,
  Search,
  Tag,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useState } from "react";
import FoodTypeIcon from "../common/FoodTypeIcon";

function FoodDot({ type }) {
  const map = {
    veg: "bg-emerald-500",
    nonveg: "bg-red-500",
    egg: "bg-amber-500",
  };
  const label = { veg: "Veg", nonveg: "Non-Veg", egg: "Egg" };
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
      <span
        className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${map[type] || "bg-slate-400"}`}
      />
      {label[type] || type}
    </span>
  );
}

export default function PreviewSection({
  previewData,
  onReset,
  onUpload,
  isUploading,
}) {
  const [activeTab, setActiveTab] = useState("items");
  const [search, setSearch] = useState("");

  const p = previewData?.preview || {};
  const tabs = [
    {
      key: "items",
      label: "Items",
      icon: UtensilsCrossed,
      data: p.items || [],
    },
    {
      key: "categories",
      label: "Categories",
      icon: Tag,
      data: p.categories || [],
    },
    {
      key: "variants",
      label: "Variants",
      icon: Layers,
      data: p.variants || [],
    },
    {
      key: "addonGroups",
      label: "Addon Groups",
      icon: PlusCircle,
      data: p.addonGroups || [],
    },
    { key: "addons", label: "Addons", icon: Plus, data: p.addons || [] },
  ];
  const cur = tabs.find((t) => t.key === activeTab);
  const filtered = (cur?.data || []).filter(
    (row) =>
      !search ||
      Object.values(row).some((v) =>
        String(v).toLowerCase().includes(search.toLowerCase()),
      ),
  );
  const total = tabs.reduce((s, t) => s + t.data.length, 0);

  const TH = ({ children }) => (
    <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap bg-slate-50 sticky top-0">
      {children}
    </th>
  );

  return (
    <div className="space-y-5">
      {/* Info */}
      <div className="flex items-center gap-4 bg-blue-50 border border-blue-200 rounded-2xl px-5 py-3.5">
        <CheckCircle2 size={17} className="text-blue-500 flex-shrink-0" />
        <div className="text-[13px] text-blue-800 flex-1">
          <span className="font-bold">Preview ready.</span> Review all{" "}
          {previewData?.totalRows} rows across {tabs.length} sections before
          importing.
        </div>
        <span className="text-[11px] font-bold text-blue-600 bg-white border border-blue-200 px-2.5 py-1 rounded-lg flex-shrink-0">
          {previewData?.totalRows} rows
        </span>
      </div>

      {/* Tabs + table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 flex-wrap">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setSearch("");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold rounded-lg transition-all
                    ${isActive ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <Icon size={12} />
                  {tab.label}
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded-full
                    ${isActive ? "bg-slate-100 text-slate-700" : "bg-slate-200 text-slate-500"}`}
                  >
                    {tab.data.length}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 ml-auto bg-slate-100 rounded-lg px-3 py-2">
            <Search size={12} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[12px] text-slate-700 outline-none w-36 placeholder:text-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div
          className="overflow-x-auto"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <table className="w-full text-left border-collapse">
            <thead>
              {activeTab === "items" && (
                <tr>
                  <TH>#</TH>
                  <TH>Name</TH>
                  <TH>Category</TH>
                  <TH>Price</TH>
                  <TH>Tax</TH>
                  <TH>Station</TH>
                </tr>
              )}
              {activeTab === "categories" && (
                <tr>
                  <TH>#</TH>
                  <TH>Name</TH>
                  <TH>Parent</TH>
                  <TH>Description</TH>
                </tr>
              )}
              {activeTab === "variants" && (
                <tr>
                  <TH>#</TH>
                  <TH>Variant</TH>
                  <TH>Item</TH>
                  <TH>Price</TH>
                  <TH>Default</TH>
                </tr>
              )}
              {activeTab === "addonGroups" && (
                <tr>
                  <TH>#</TH>
                  <TH>Group Name</TH>
                  <TH>Selection</TH>
                  <TH>Min</TH>
                  <TH>Max</TH>
                </tr>
              )}
              {activeTab === "addons" && (
                <tr>
                  <TH>#</TH>
                  <TH>Name</TH>
                  <TH>Group</TH>
                  <TH>Price</TH>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-[13px] text-slate-400"
                  >
                    No rows match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-[11px] font-bold text-slate-400">
                      {i + 1}
                    </td>
                    {activeTab === "items" && (
                      <>
                        <td className="px-4 py-3 text-[12px] font-semibold text-slate-800 flex gap-2 items-center">
                          <FoodTypeIcon type={row.foodType} />
                          {row.name}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-600">
                          {row.category}
                        </td>
                        <td className="px-4 py-3 text-[12px] font-bold text-slate-800">
                          ₹{row.price}
                        </td>

                        <td className="px-4 py-3 text-[12px]">
                          {row.gst != null && row.gst !== "" ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold text-[11px]">
                              GST {row.gst}%
                            </span>
                          ) : row.vat != null && row.vat !== "" ? (
                            <span className="text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full font-semibold text-[11px]">
                              VAT {row.vat}%
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-500">
                          {row.station}
                        </td>
                      </>
                    )}
                    {activeTab === "categories" && (
                      <>
                        <td className="px-4 py-3 text-[12px] font-semibold text-slate-800">
                          {row.name}
                        </td>
                        <td className="px-4 py-3">
                          {row.parent ? (
                            <span className="text-[11px] font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">
                              {row.parent}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              Root
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-500">
                          {row.description || "—"}
                        </td>
                      </>
                    )}
                    {activeTab === "variants" && (
                      <>
                        <td className="px-4 py-3 text-[12px] font-semibold text-slate-800">
                          {row.name}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-600">
                          {row.item}
                        </td>
                        <td className="px-4 py-3 text-[12px] font-bold text-slate-800">
                          ₹{row.price}
                        </td>
                        <td className="px-4 py-3">
                          {row.isDefault === "yes" ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              —
                            </span>
                          )}
                        </td>
                      </>
                    )}
                    {activeTab === "addonGroups" && (
                      <>
                        <td className="px-4 py-3 text-[12px] font-semibold text-slate-800">
                          {row.name}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                        ${row.selectionType === "multiple" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}
                          >
                            {row.selectionType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-600">
                          {row.min}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-600">
                          {row.max}
                        </td>
                      </>
                    )}
                    {activeTab === "addons" && (
                      <>
                        <td className="px-4 py-3 text-[12px] font-semibold text-slate-800 flex items-center gap-2">
                          <FoodTypeIcon type={row.foodType} />
                          {row.name}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-600">
                          {row.group}
                        </td>
                        <td className="px-4 py-3 text-[12px] font-bold text-slate-800">
                          {row.price === "0" || row.price === 0 ? (
                            <span className="text-slate-400 font-medium">
                              Free
                            </span>
                          ) : (
                            `₹${row.price}`
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            Showing {filtered.length} of {cur?.data.length} {activeTab}
          </span>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-[11px] text-primary-600 font-semibold hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 justify-between pt-1">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-[13px] font-semibold text-slate-600 bg-white border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all"
        >
          <RotateCcw size={13} /> Upload Different File
        </button>
        <button
          onClick={onUpload}
          disabled={isUploading}
          className="flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[13px] px-6 py-2.5 rounded-xl disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <PackagePlus size={14} />
              Import {total} Records
            </>
          )}
        </button>
      </div>
    </div>
  );
}
