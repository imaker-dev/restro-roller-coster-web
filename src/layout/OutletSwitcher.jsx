import { Fragment, useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { ChevronDown, Check, X, Hotel, Search, Building2 } from "lucide-react";
import { setOutletId } from "../redux/slices/authSlice";

// ─── Avatar initials tile ─────────────────────────────────────────────────────
function OutletAvatar({ name, active = false, size = "sm" }) {
  const initials = name
    ?.split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const sizeMap = {
    sm: "h-6 w-6 text-[9px]",
    md: "h-9 w-9 text-[11px]",
  };

  return (
    <div
      className={`shrink-0 flex items-center justify-center rounded-lg font-black ${sizeMap[size]} ${
        active ? "bg-primary-100 text-primary-600" : "bg-gray-100 text-gray-500"
      }`}
    >
      {initials || <Building2 size={size === "sm" ? 10 : 14} strokeWidth={2} />}
    </div>
  );
}

// ─── Shared outlet list row ───────────────────────────────────────────────────
function OutletRow({ outlet, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
        selected
          ? "bg-primary-50 text-primary-700"
          : "hover:bg-gray-50 text-gray-700"
      }`}
    >
      <OutletAvatar name={outlet.name} active={selected} size="md" />
      <div className="flex-1 min-w-0">
        <p
          className={`text-[13px] font-semibold truncate leading-none ${
            selected ? "text-primary-700" : "text-gray-900"
          }`}
        >
          {outlet.name}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">
          {selected ? "Active outlet" : `ID #${outlet.id}`}
        </p>
      </div>
      {selected && (
        <div className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500">
          <Check size={11} className="text-white" strokeWidth={3} />
        </div>
      )}
    </button>
  );
}

// ─── Search input ─────────────────────────────────────────────────────────────
function SearchInput({ value, onChange, inputRef }) {
  return (
    <div className="relative">
      <Search
        size={13}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        strokeWidth={2}
      />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search outlets…"
        className="w-full pl-8 pr-3 py-2 text-[13px] bg-gray-50 border border-gray-100 rounded-xl outline-none placeholder-gray-400 text-gray-900 focus:border-gray-300 focus:bg-white transition-all"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const OutletSwitcher = () => {
  const dispatch = useDispatch();
  const { outlets = [], outletId } = useSelector((state) => state.auth);

  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const popoverRef = useRef(null);
  const searchRef = useRef(null);

  const selectedOutlet =
    outlets.find((o) => o.id === Number(outletId)) || outlets[0];

  const filtered = useMemo(() => {
    if (!query.trim()) return outlets;
    const q = query.toLowerCase();
    return outlets.filter((o) => o.name.toLowerCase().includes(q));
  }, [outlets, query]);

  const handleChange = (outlet) => {
    dispatch(setOutletId(outlet.id));
    setDesktopOpen(false);
    setMobileOpen(false);
    setQuery("");
  };

  // Close desktop popover on outside click
  useEffect(() => {
    if (!desktopOpen) return;
    const handler = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setDesktopOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [desktopOpen]);

  // Focus search when desktop popover opens
  useEffect(() => {
    if (desktopOpen && outlets.length > 5) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [desktopOpen, outlets.length]);

  if (!outlets.length) return null;

  // ── Trigger button (shared shape) ──────────────────────────────────────────
  const Trigger = ({ onClick }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all group max-w-[180px]"
    >
      <OutletAvatar name={selectedOutlet?.name} active size="sm" />
      <span className="text-[12.5px] font-semibold text-gray-800 truncate flex-1 min-w-0">
        {selectedOutlet?.name}
      </span>
      {outlets.length > 1 && (
        <ChevronDown
          size={13}
          strokeWidth={2.5}
          className={`shrink-0 text-gray-400 group-hover:text-gray-600 transition-all duration-200 ${
            desktopOpen ? "rotate-180" : ""
          }`}
        />
      )}
    </button>
  );

  // Single outlet — no switcher
  if (outlets.length === 1) {
    return (
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-gray-200 bg-white max-w-[180px]">
        <OutletAvatar name={selectedOutlet?.name} active size="sm" />
        <span className="text-[12.5px] font-semibold text-gray-800 truncate">
          {selectedOutlet?.name}
        </span>
      </div>
    );
  }

  return (
    <>
      {/* ── DESKTOP popover ── */}
      <div className="hidden md:block relative" ref={popoverRef}>
        <Trigger onClick={() => setDesktopOpen((p) => !p)} />

        {desktopOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-black/[0.08] z-50 overflow-hidden">
            {/* Header */}
            <div className="px-4 pt-4 pb-3 border-b border-gray-100">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Switch Outlet
              </p>
              {outlets.length > 4 && (
                <SearchInput
                  value={query}
                  onChange={setQuery}
                  inputRef={searchRef}
                />
              )}
            </div>

            {/* List */}
            <div className="p-2 max-h-64 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-[12px] text-gray-400">No outlets found</p>
                </div>
              ) : (
                filtered.map((outlet) => (
                  <OutletRow
                    key={outlet.id}
                    outlet={outlet}
                    selected={outlet.id === selectedOutlet?.id}
                    onClick={() => handleChange(outlet)}
                  />
                ))
              )}
            </div>

            {/* Count footer */}
            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/60">
              <p className="text-[11px] text-gray-400">
                {filtered.length} of {outlets.length} outlets
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE trigger + bottom sheet ── */}
      <div className="md:hidden">
        <Trigger onClick={() => setMobileOpen(true)} />

        <Transition show={mobileOpen} as={Fragment}>
          <Dialog
            onClose={() => {
              setMobileOpen(false);
              setQuery("");
            }}
            className="relative z-50"
          >
            {/* Backdrop */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
            </Transition.Child>

            {/* Sheet */}
            <div className="fixed inset-x-0 bottom-0 flex">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
              >
                <Dialog.Panel className="w-full bg-white rounded-t-2xl shadow-2xl max-h-[75vh] flex flex-col">
                  {/* Drag pill */}
                  <div className="flex justify-center pt-3 pb-1">
                    <div className="h-1 w-10 rounded-full bg-gray-200" />
                  </div>

                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                    <div>
                      <Dialog.Title className="text-[15px] font-bold text-gray-900">
                        Switch Outlet
                      </Dialog.Title>
                      <p className="text-[11.5px] text-gray-400 mt-0.5">
                        {outlets.length} outlets available
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        setQuery("");
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <X size={15} className="text-gray-600" strokeWidth={2} />
                    </button>
                  </div>

                  {/* Search — always shown on mobile */}
                  {outlets.length > 3 && (
                    <div className="px-4 pt-3 pb-1">
                      <SearchInput value={query} onChange={setQuery} />
                    </div>
                  )}

                  {/* List */}
                  <div className="flex-1 overflow-y-auto px-3 py-2">
                    {filtered.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-[13px] text-gray-400">
                          No outlets found
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        {filtered.map((outlet) => (
                          <OutletRow
                            key={outlet.id}
                            outlet={outlet}
                            selected={outlet.id === selectedOutlet?.id}
                            onClick={() => handleChange(outlet)}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        setQuery("");
                      }}
                      className="w-full py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  );
};

export default OutletSwitcher;
