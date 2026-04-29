import { useState, useEffect, useMemo } from "react";
import {
  Filter,
  ListFilter,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";

/* ─── How many options to show before "Show more" ────────────────────────── */
const COLLAPSE_THRESHOLD = 6;

/* ═══════════════════════════════════════════════════════════════════════════
   FilterGroup — one section inside the sidebar
═══════════════════════════════════════════════════════════════════════════ */
function FilterGroup({ group, draftFilters, onCheckbox, onRadio, onClear }) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const options = group.options ?? [];
  const isLong = options.length > COLLAPSE_THRESHOLD;
  const hasSearch = options.length > COLLAPSE_THRESHOLD;

  /* filter by search query */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? options.filter((o) => o.label.toLowerCase().includes(q))
      : options;
  }, [options, query]);

  /* slice for collapse */
  const visible =
    !isLong || expanded || query
      ? filtered
      : filtered.slice(0, COLLAPSE_THRESHOLD);
  const hiddenCount = filtered.length - visible.length;

  const isActive = (val) =>
    group.type === "checkbox"
      ? (draftFilters[group.id] ?? []).includes(val)
      : draftFilters[group.id] === val;

  const activeCount =
    group.type === "checkbox"
      ? (draftFilters[group.id] ?? []).length
      : draftFilters[group.id]
        ? 1
        : 0;

  return (
    <div className="border-b border-slate-100 last:border-0 pb-5 last:pb-0">
      {/* Group header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-widest">
            {group.title}
          </span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center bg-primary-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 px-1 leading-none">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={() => onClear(group.id)}
            className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors duration-150 uppercase tracking-wide"
          >
            Clear
          </button>
        )}
      </div>

      {/* Search box — only when list is long */}
      {hasSearch && (
        <div className="relative mb-3">
          <Search
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            strokeWidth={2.5}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setExpanded(true);
            }}
            placeholder={`Search ${group.title.toLowerCase()}…`}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={11} strokeWidth={2.5} />
            </button>
          )}
        </div>
      )}

      {/* Options list */}
      {visible.length === 0 ? (
        <p className="text-xs text-slate-400 italic py-1">
          No results for "{query}"
        </p>
      ) : (
        <div className="space-y-0.5">
          {visible.map((option) => {
            const checked = isActive(option.value);
            return (
              <label
                key={option.id}
                className={`flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer transition-colors duration-100 group ${
                  checked ? "bg-primary-50" : "hover:bg-slate-50"
                }`}
              >
                {/* Custom checkbox / radio */}
                <div className="flex-shrink-0">
                  {group.type === "checkbox" ? (
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150 ${
                        checked
                          ? "bg-primary-500 border-primary-500"
                          : "border-slate-300 group-hover:border-primary-400"
                      }`}
                      onClick={() =>
                        onCheckbox(group.id, option.value, !checked)
                      }
                    >
                      {checked && (
                        <Check
                          size={12}
                          className="text-white"
                          strokeWidth={4}
                        />
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={() => onRadio(group.id, option.value)}
                      className={`relative w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all duration-150 ${
                        checked
                          ? "border-primary-500"
                          : "border-slate-300 group-hover:border-primary-400"
                      }`}
                    >
                      <div
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500 transition-all duration-150 ${
                          checked ? "w-2 h-2" : "w-0 h-0"
                        }`}
                      />
                    </div>
                  )}
                </div>

                <span
                  className={`text-sm leading-snug flex-1 transition-colors duration-100 ${
                    checked
                      ? "font-semibold text-primary-700"
                      : "font-medium text-slate-600 group-hover:text-slate-800"
                  }`}
                  onClick={() =>
                    group.type === "checkbox"
                      ? onCheckbox(group.id, option.value, !checked)
                      : onRadio(group.id, option.value)
                  }
                >
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      )}

      {/* Show more / less — only when no search query */}
      {isLong && !query && (
        <button
          onClick={() => setExpanded((p) => !p)}
          className="mt-2 flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-primary-600 transition-colors duration-150 px-2"
        >
          {expanded ? (
            <>
              <ChevronUp size={12} strokeWidth={2.5} />
              Show less
            </>
          ) : (
            <>
              <ChevronDown size={12} strokeWidth={2.5} />
              {hiddenCount} more
            </>
          )}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SidebarFilter — main component (API unchanged)
═══════════════════════════════════════════════════════════════════════════ */
export default function SidebarFilter({
  filterGroups = [],
  filters = {},
  onApplyFilters,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState(filters);

  const safeFilterGroups = filterGroups ?? [];

  /* Sync draft when sidebar opens */
  useEffect(() => {
    if (isOpen) setDraftFilters(filters);
  }, [isOpen]);

  /* ── handlers (unchanged logic) ── */
  const handleCheckboxChange = (groupId, optionValue, checked) => {
    const current = draftFilters[groupId] ?? [];
    setDraftFilters((prev) => ({
      ...prev,
      [groupId]: checked
        ? [...current, optionValue]
        : current.filter((v) => v !== optionValue),
    }));
  };

  const handleRadioChange = (groupId, optionValue) => {
    setDraftFilters((prev) => ({
      ...prev,
      [groupId]: prev[groupId] === optionValue ? "" : optionValue,
    }));
  };

  const clearFilterGroup = (groupId) => {
    const group = safeFilterGroups.find((g) => g.id === groupId);
    setDraftFilters((prev) => ({
      ...prev,
      [groupId]: group?.type === "checkbox" ? [] : "",
    }));
  };

  const clearAllFilters = () => {
    const cleared = {};
    safeFilterGroups.forEach((g) => {
      cleared[g.id] = g.type === "checkbox" ? [] : "";
    });
    setDraftFilters(cleared);
  };

  const applyFilters = () => {
    onApplyFilters(draftFilters);
    setIsOpen(false);
  };

  /* ── counts ── */

  /* Applied count — shown on the trigger button badge */
  const appliedCount = Object.values(filters).reduce((n, v) => {
    return n + (Array.isArray(v) ? v.length : v ? 1 : 0);
  }, 0);

  /* Pending (draft) count — shown inside Apply button */
  const pendingCount = Object.values(draftFilters).reduce((n, v) => {
    return n + (Array.isArray(v) ? v.length : v ? 1 : 0);
  }, 0);

  /* ── disabled state ── */
  if (!safeFilterGroups.length) {
    return (
      <button
        className={`btn bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed ${className}`}
        disabled
      >
        <ListFilter size={16} className="md:mr-2" />
        <span className="hidden md:block">Filters</span>
      </button>
    );
  }

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        onClick={() => setIsOpen(true)}
        className={`btn relative bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 ${className}`}
      >
        <ListFilter size={16} className="md:mr-2 flex-shrink-0" />
        <span className="hidden md:block font-semibold text-slate-700">
          Filters
        </span>
        {appliedCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none shadow-sm">
            {appliedCount}
          </span>
        )}
      </button>

      {/* ── Mobile overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Sidebar panel ── */}
      <div
        className={`
          fixed bg-white shadow-2xl z-50
          flex flex-col
          transition-transform duration-300 ease-in-out

          /* Mobile — slide up from bottom */
          bottom-0 left-0 right-0
          h-[88vh] max-h-[560px]
          border-t border-slate-200 rounded-t-2xl
          ${isOpen ? "translate-y-0" : "translate-y-full"}

          /* Desktop — slide in from right */
          lg:top-0 lg:right-0 lg:left-auto lg:bottom-auto
          lg:h-screen lg:w-[320px] lg:max-h-none
          lg:border-l lg:border-t-0 lg:rounded-none
          ${isOpen ? "lg:translate-x-0" : "lg:translate-x-full"} lg:translate-y-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
              <Filter size={13} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 leading-none">
                Filters
              </h2>
              {appliedCount > 0 && (
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                  {appliedCount} applied
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors duration-150"
          >
            <X size={15} className="text-slate-500" strokeWidth={2.5} />
          </button>
        </div>

        {/* Filter groups — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {safeFilterGroups.map((group) => (
            <FilterGroup
              key={group.id}
              group={group}
              draftFilters={draftFilters}
              onCheckbox={handleCheckboxChange}
              onRadio={handleRadioChange}
              onClear={clearFilterGroup}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-slate-100 px-5 py-4 bg-white">
          <div className="flex gap-2.5">
            <button
              onClick={clearAllFilters}
              className="btn flex-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold text-sm transition-all duration-150"
            >
              Clear All
            </button>
            <button
              onClick={applyFilters}
              className="btn flex-[2] bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm shadow-sm shadow-primary-500/20 transition-all duration-150 gap-2"
            >
              Apply Filters
              {pendingCount > 0 && (
                <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
