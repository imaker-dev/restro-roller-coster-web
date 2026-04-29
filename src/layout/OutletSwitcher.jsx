import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Listbox, Transition, Dialog } from "@headlessui/react";
import { ChevronsUpDown, Check, X, Hotel } from "lucide-react";
import { setOutletId } from "../redux/slices/authSlice";

const OutletSwitcher = () => {
  const dispatch = useDispatch();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { outlets, outletId } = useSelector((state) => state.auth);
  if (!outlets.length) return null;

  const selectedOutlet =
    outlets.find((o) => o.id === Number(outletId)) || outlets[0];

  const handleChange = (outlet) => {
    dispatch(setOutletId(outlet.id));
    setIsMobileOpen(false);
  };

  // Single outlet - no dropdown needed
  if (outlets.length === 1) {
    return (
      <div className="w-48 lg:w-52 flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg">
        <Hotel size={16} className="text-gray-600 flex-shrink-0" />

        <span className="flex-1 truncate text-sm font-medium text-gray-800">
          {selectedOutlet.name}
        </span>
      </div>
    );
  }

  return (
    <>
      {/* ═══════════════════════════════════════════════
          DESKTOP VERSION (≥ md: Headless UI Listbox)
      ═══════════════════════════════════════════════ */}
      <div className="hidden md:block">
        <Listbox value={selectedOutlet} onChange={handleChange}>
          <div className="relative">
            {/* Button */}
            <Listbox.Button className="w-48 lg:w-52 flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-left hover:bg-gray-200 transition-colors group">
              <Hotel size={16} className="text-gray-600 flex-shrink-0" />

              <span className="flex-1 truncate text-sm font-medium text-gray-800">
                {selectedOutlet.name}
              </span>
              <ChevronsUpDown
                size={16}
                className="text-gray-500 group-hover:text-gray-700 transition-colors flex-shrink-0"
              />
            </Listbox.Button>

            {/* Dropdown */}
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Listbox.Options className="absolute right-0 mt-2 w-64 max-h-80 overflow-auto bg-white border border-gray-200 rounded-xl shadow-lg z-50 outline-none py-1">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Switch Outlet
                  </p>
                </div>
                {outlets.map((outlet) => (
                  <Listbox.Option
                    key={outlet.id}
                    value={outlet}
                    className={({ active }) =>
                      `cursor-pointer select-none px-3 py-2.5 flex items-center gap-3 transition-colors ${
                        active ? "bg-primary-50" : ""
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            selected ? "bg-primary-100" : "bg-gray-100"
                          }`}
                        >
                          <Hotel
                            size={16}
                            className={
                              selected ? "text-primary-600" : "text-gray-500"
                            }
                          />
                        </div>
                        <span
                          title={outlet.name}
                          className={`flex-1 text-sm truncate ${
                            selected
                              ? "font-semibold text-primary-600"
                              : "font-medium text-gray-700"
                          }`}
                        >
                          {outlet.name}
                        </span>
                        {selected && (
                          <Check
                            size={16}
                            className="text-primary-600 flex-shrink-0"
                            strokeWidth={2.5}
                          />
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>

      {/* ═══════════════════════════════════════════════
          MOBILE VERSION (< md: Dialog Modal)
      ═══════════════════════════════════════════════ */}
      <div className="md:hidden">
        {/* Trigger Button */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Hotel size={16} className="text-gray-600 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-800 truncate max-w-[120px]">
            {selectedOutlet.name}
          </span>
          <ChevronsUpDown size={16} className="text-gray-500 flex-shrink-0" />
        </button>

        {/* Modal */}
        <Transition show={isMobileOpen} as={Fragment}>
          <Dialog
            onClose={() => setIsMobileOpen(false)}
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

            {/* Modal Panel */}
            <div className="fixed inset-0 flex items-end">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="ease-in duration-150"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
              >
                <Dialog.Panel className="w-full bg-white rounded-t-3xl shadow-xl max-h-[80vh] flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div>
                      <Dialog.Title className="text-lg font-bold text-gray-900">
                        Switch Outlet
                      </Dialog.Title>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Select an outlet to continue
                      </p>
                    </div>
                    <button
                      onClick={() => setIsMobileOpen(false)}
                      className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <X size={18} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Outlet List */}
                  <div className="flex-1 overflow-y-auto px-4 py-3">
                    <div className="space-y-2">
                      {outlets.map((outlet) => {
                        const isSelected = outlet.id === selectedOutlet.id;
                        return (
                          <button
                            key={outlet.id}
                            onClick={() => handleChange(outlet)}
                            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-all ${
                              isSelected
                                ? "border-primary-500 bg-primary-50"
                                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                isSelected ? "bg-primary-100" : "bg-gray-100"
                              }`}
                            >
                              <Hotel
                                size={20}
                                className={
                                  isSelected
                                    ? "text-primary-600"
                                    : "text-gray-500"
                                }
                              />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <p
                                className={`text-sm font-semibold truncate ${
                                  isSelected
                                    ? "text-primary-600"
                                    : "text-gray-900"
                                }`}
                              >
                                {outlet.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {isSelected
                                  ? "Currently active"
                                  : "Tap to switch"}
                              </p>
                            </div>
                            {isSelected && (
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                                <Check
                                  size={14}
                                  className="text-white"
                                  strokeWidth={3}
                                />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer (optional safe area for iOS) */}
                  <div className="px-6 py-4 border-t border-gray-100 safe-area-bottom">
                    <button
                      onClick={() => setIsMobileOpen(false)}
                      className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition-colors"
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
