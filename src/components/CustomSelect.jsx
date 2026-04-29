import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Check, ChevronDown, Loader2 } from "lucide-react";

const CustomSelect = ({
  options = [],
  value = null,
  onChange,
  placeholder = "Select option",
  loading = false,
  disabled = false,
  width = "w-48", // <-- fixed width default
  error = false,
  getOptionLabel = (option) => option?.label,
}) => {
  return (
    <div className={`${width} shrink-0`}>
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative w-full">
          {/* Button */}
          <ListboxButton
            className={`
              form-select w-full h-10
              rounded-md border bg-white
              pl-3 pr-10 text-sm text-left
              flex items-center
              ${error ? "border-red-500" : "border-slate-300"}
              ${disabled ? "bg-slate-100 cursor-not-allowed" : ""}
            `}
          >
            <span className="truncate">
              {value ? getOptionLabel(value) : placeholder}
            </span>

            <span className="absolute right-3 flex items-center pointer-events-none">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </span>
          </ListboxButton>

          {/* Dropdown */}
          <ListboxOptions className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border border-slate-200 bg-white shadow-lg focus:outline-none focus:ring-0 ring-0">
            {options.length === 0 && (
              <div className="px-3 py-2 text-slate-400 text-sm">
                No options found
              </div>
            )}

            {options.map((option, index) => (
              <ListboxOption
                key={index}
                value={option}
                className={({ active }) =>
                  `cursor-pointer px-3 py-2 text-sm flex justify-between ${
                    active ? "bg-slate-100" : ""
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span className="truncate">{getOptionLabel(option)}</span>

                    {selected && (
                      <Check className="w-4 h-4 text-primary-600 shrink-0" />
                    )}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
};

export default CustomSelect;
