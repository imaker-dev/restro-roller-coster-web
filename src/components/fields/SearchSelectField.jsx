import React, { useEffect, useRef, useState, useCallback } from "react";
import { Search, X, CheckCircle2, ChevronDown } from "lucide-react";
import { FieldWrapper } from "./FieldWrapper";

export function SearchSelectField({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = "Search...",
  error,
  required,
  disabled,
  loading,
  onSearch,
}) {
  const [query,          setQuery]          = useState("");
  const [open,           setOpen]           = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const containerRef   = useRef(null);
  const searchTimerRef = useRef(null);

  // Keep latest callbacks in refs so no stale-closure issues
  const onSearchRef  = useRef(onSearch);
  const onChangeRef  = useRef(onChange);
  useEffect(() => { onSearchRef.current  = onSearch;  }, [onSearch]);
  useEffect(() => { onChangeRef.current  = onChange;  }, [onChange]);

  // ── Sync selected option ────────────────────────────────────────────────
  // Only update selectedOption when options contain the value OR when value
  // is cleared. If the value exists but isn't in the current filtered list
  // (e.g. after a search), keep the last known selectedOption so the label
  // doesn't disappear.
  useEffect(() => {
    if (!value) {
      setSelectedOption(null);
      return;
    }
    const found = options.find((o) => String(o.value) === String(value));
    if (found) setSelectedOption(found);
    // intentionally do NOT clear selectedOption when found is undefined —
    // that just means the item isn't in the current (filtered) list
  }, [value, options]);

  // ── Local filter (only used when no onSearch prop) ──────────────────────
  const filtered = onSearch
    ? options
    : query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  // ── Close on outside click ──────────────────────────────────────────────
  useEffect(() => {
    const handle = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // ── Clear local query when dropdown closes ──────────────────────────────
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  // ── Cleanup debounce timer on unmount ───────────────────────────────────
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  // ── Open / close toggle ─────────────────────────────────────────────────
  // Resets to full list on open so previous search results don't bleed into
  // the next field that opens.
  const handleOpen = useCallback(() => {
    if (disabled) return;
    setOpen((prev) => {
      const opening = !prev;
      if (opening) {
        setQuery("");
        if (onSearchRef.current) {
          if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
          onSearchRef.current("");
        }
      }
      return opening;
    });
  }, [disabled]);

  // ── Debounced query change ──────────────────────────────────────────────
  const handleQueryChange = useCallback((e) => {
    const q = e.target.value;
    setQuery(q);
    if (!onSearchRef.current) return;
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      onSearchRef.current(q);
    }, 400);
  }, []);

  // ── Clear search input ──────────────────────────────────────────────────
  const handleClearQuery = useCallback(() => {
    setQuery("");
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (onSearchRef.current) onSearchRef.current("");
  }, []);

  // ── Clear selection ─────────────────────────────────────────────────────
  const handleClearSelection = useCallback((e) => {
    e.stopPropagation();
    onChangeRef.current("");    // use ref — no dep on onChange
    setSelectedOption(null);
    setQuery("");
  }, []); // stable — no deps needed

  // ── Select option ───────────────────────────────────────────────────────
  const handleSelect = useCallback((item) => {
    onChangeRef.current(item.value);  // use ref — no dep on onChange
    setSelectedOption(item);
    setOpen(false);
  }, []); // stable — no deps needed

  return (
    <FieldWrapper label={label} required={required} error={error}>
      <div ref={containerRef} className="relative">

        {/* ── Trigger ── */}
        <button
          type="button"
          onClick={handleOpen}
          onBlur={onBlur}
          disabled={disabled}
          className={[
            "w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-sm transition-all duration-150",
            error ? "border-red-400" : "",
            disabled
              ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-70"
              : open
              ? "bg-white border-primary-400 ring-2 ring-primary-100"
              : "bg-white border-slate-200 hover:border-slate-300",
          ].filter(Boolean).join(" ")}
        >
          <span className={`truncate ${selectedOption ? "text-slate-800 font-medium" : "text-slate-400"}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <div className="flex items-center gap-1 flex-shrink-0">
            {selectedOption && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClearSelection}
                onKeyDown={(e) => e.key === "Enter" && handleClearSelection(e)}
                className="p-1 rounded hover:bg-slate-100 cursor-pointer"
              >
                <X size={13} className="text-slate-400" />
              </span>
            )}
            <ChevronDown
              size={15}
              className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </div>
        </button>

        {/* ── Dropdown ── */}
        {open && (
          <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">

            {/* Search input */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-100 bg-slate-50">
              <Search size={14} className="text-slate-400 flex-shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={handleQueryChange}
                placeholder="Search..."
                className="w-full text-sm bg-transparent outline-none placeholder:text-slate-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClearQuery}
                  className="p-1 rounded hover:bg-slate-200 flex-shrink-0"
                >
                  <X size={13} className="text-slate-500" />
                </button>
              )}
            </div>

            {/* Options */}
            <div className="max-h-56 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-sm text-slate-400 text-center">Loading…</div>
              ) : filtered.length === 0 ? (
                <div className="p-4 text-sm text-slate-400 text-center">No results found</div>
              ) : (
                filtered.map((item) => {
                  const isSelected = String(value) === String(item.value);
                  return (
                    <div
                      key={item.value}
                      onClick={() => handleSelect(item)}
                      className={[
                        "flex items-center justify-between px-3.5 py-2.5 text-sm cursor-pointer transition-colors",
                        isSelected ? "bg-primary-50 text-primary-700" : "hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <span className="truncate">{item.label}</span>
                      {isSelected && (
                        <CheckCircle2 size={15} className="text-primary-600 flex-shrink-0" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}