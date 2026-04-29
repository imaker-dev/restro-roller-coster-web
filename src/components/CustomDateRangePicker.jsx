import { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../css/additional-styles/date-range-picker.css";
import { Calendar, X } from "lucide-react";
import { formatDate } from "../utils/dateFormatter";
import { DEFAULT_DATE_RANGE, PREDEFINED_RANGES } from "../constants";

// ---------- Business Hours Configuration ----------
const BUSINESS_HOURS = {
  startHour: 4,  // 4:00 AM
  startMinute: 0,
};

// ---------- Core Business Day Logic ----------
// This function determines what "day" it is based on business hours
const getCurrentBusinessDay = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  const cutoffTimeInMinutes = BUSINESS_HOURS.startHour * 60 + BUSINESS_HOURS.startMinute;
  
  // Create date object for the business day
  const businessDay = new Date(now);
  
  // If before cutoff (before 4:00 AM), we're still in previous business day
  if (currentTimeInMinutes < cutoffTimeInMinutes) {
    businessDay.setDate(businessDay.getDate() - 1);
  }
  
  // Reset to midnight of that business day
  businessDay.setHours(0, 0, 0, 0);
  
  return businessDay;
};

// Get start of business day (4:00 AM)
const getBusinessDayStart = (date) => {
  const d = new Date(date);
  d.setHours(BUSINESS_HOURS.startHour, BUSINESS_HOURS.startMinute, 0, 0);
  return d;
};

// Get end of business day (4:00 AM next day)
const getBusinessDayEnd = (date) => {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  d.setHours(BUSINESS_HOURS.startHour, BUSINESS_HOURS.startMinute, 0, 0);
  return d;
};

// ---------- Helpers ----------
const startOfDay = (d) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfDay = (d) => {
  const date = new Date(d);
  date.setHours(23, 59, 59, 999);
  return date;
};

const toISODate = (date) => {
  if (!date) return null;
  
  try {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return null;
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Invalid date provided to toISODate:', date, error);
    return null;
  }
};

// ---------- Sidebar Component (Memoized) ----------
const RangeList = memo(({ activeRange, onSelect, isMobile }) => {
  return (
    <div className={`space-y-1 ${isMobile ? "p-2" : ""}`}>
      {PREDEFINED_RANGES.map((range) => (
        <button
          key={range}
          onClick={() => onSelect(range)}
          className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors rounded
            ${
              activeRange === range
                ? "bg-primary-500 text-white shadow-sm"
                : "hover:bg-gray-100 text-gray-700"
            }`}
        >
          {range}
        </button>
      ))}
    </div>
  );
});

RangeList.displayName = 'RangeList';

// ---------- Main Component ----------
export default function CustomDateRangePicker({
  onChange,
  value,
  placeholder = "Select date range to filter",
  defaultRange = DEFAULT_DATE_RANGE,
  className = "",
}) {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Get current business day (the actual day it should be based on 4 AM cutoff)
  const currentBusinessDay = useMemo(() => {
    return getCurrentBusinessDay();
  }, []);

  const getInitialRange = useMemo(() => {
    const start = new Date(currentBusinessDay);
    start.setDate(currentBusinessDay.getDate() - 6);
    return {
      startDate: startOfDay(start),
      endDate: endOfDay(currentBusinessDay),
      key: "selection",
    };
  }, [currentBusinessDay]);

  const [isOpen, setIsOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const [activeRange, setActiveRange] = useState(defaultRange);
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const [selectedRange, setSelectedRange] = useState(
    value
      ? { ...value, key: "selection" }
      : defaultRange
        ? getInitialRange
        : null,
  );

  const [tempRange, setTempRange] = useState(selectedRange);

  // Detect mobile screen size with debounce
  useEffect(() => {
    let timeoutId;
    
    const checkMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 100);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
      clearTimeout(timeoutId);
    };
  }, []);

  // Sync external value
  useEffect(() => {
    if (value?.startDate && value?.endDate) {
      const newRange = { 
        startDate: new Date(value.startDate), 
        endDate: new Date(value.endDate), 
        key: "selection" 
      };
      setSelectedRange(newRange);
      setTempRange(newRange);
    }
  }, [value]);

  // Outside click
  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setIsOpen(false);
        setShowCustomPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ESC close
  useEffect(() => {
    const keyHandler = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setShowCustomPicker(false);
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);

  // Auto flip alignment
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const popWidth = showCustomPicker ? (isMobile ? 320 : 850) : 240;
    const spaceRight = window.innerWidth - rect.left;
    const spaceLeft = rect.right;

    if (spaceRight < popWidth && spaceLeft > spaceRight) {
      setAlignRight(true);
    } else {
      setAlignRight(false);
    }
  }, [isOpen, showCustomPicker, isMobile]);

  const formatDisplayValue = useCallback(
    (range = selectedRange) => {
      if (!range?.startDate || !range?.endDate) return placeholder;
      const startStr = formatDate(range.startDate, isMobile ? "short" : "long");
      const endStr = formatDate(range.endDate, isMobile ? "short" : "long");
      return `${startStr} - ${endStr}`;
    },
    [selectedRange, placeholder, isMobile],
  );

  const getDateRange = useCallback(
    (range) => {
      // Always get fresh current business day when calculating ranges
      const today = getCurrentBusinessDay();
      
      // Yesterday
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // This month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

      switch (range) {
        case "Today":
          return {
            startDate: startOfDay(today),
            endDate: endOfDay(today),
            key: "selection",
          };
        case "Yesterday":
          return {
            startDate: startOfDay(yesterday),
            endDate: endOfDay(yesterday),
            key: "selection",
          };
        case "Last 7 Days": {
          const start = new Date(today);
          start.setDate(today.getDate() - 6);
          return {
            startDate: startOfDay(start),
            endDate: endOfDay(today),
            key: "selection",
          };
        }
        case "Last 30 Days": {
          const start = new Date(today);
          start.setDate(today.getDate() - 29);
          return {
            startDate: startOfDay(start),
            endDate: endOfDay(today),
            key: "selection",
          };
        }
        case "This Month":
          return {
            startDate: startOfDay(startOfMonth),
            endDate: endOfDay(endOfMonth),
            key: "selection",
          };
        case "Last Month":
          return {
            startDate: startOfDay(startOfLastMonth),
            endDate: endOfDay(endOfLastMonth),
            key: "selection",
          };
        default:
          return selectedRange;
      }
    },
    [selectedRange],
  );

  const handleRangeSelect = useCallback(
    (range) => {
      setActiveRange(range);

      if (range === "Custom Range") {
        setShowCustomPicker(true);
        setTempRange(selectedRange);
        return;
      }

      const newRange = getDateRange(range);
      setSelectedRange(newRange);
      setShowCustomPicker(false);
      
      // Return the actual dates (which now reflect the correct business day)
      onChange?.({
        startDate: toISODate(newRange.startDate),
        endDate: toISODate(newRange.endDate),
      });
      setIsOpen(false);
    },
    [getDateRange, onChange, selectedRange],
  );

  const handleApply = useCallback(() => {
    setSelectedRange(tempRange);
    setActiveRange("Custom Range");
    setShowCustomPicker(false);
    onChange?.({
      startDate: toISODate(tempRange.startDate),
      endDate: toISODate(tempRange.endDate),
    });
    setIsOpen(false);
  }, [tempRange, onChange]);

  const handleCancel = useCallback(() => {
    setTempRange(selectedRange);
    setShowCustomPicker(false);
  }, [selectedRange]);

  // Initialize with default range on mount
  useEffect(() => {
    if (!value && defaultRange) {
      const initialRange = getDateRange(defaultRange);
      setSelectedRange(initialRange);
      onChange?.({
        startDate: toISODate(initialRange.startDate),
        endDate: toISODate(initialRange.endDate),
      });
    }
  }, []); // Run only on mount

  // Sync active range label with external value
  useEffect(() => {
    if (!value?.startDate || !value?.endDate) return;

    const valueStart = value.startDate;
    const valueEnd = value.endDate;

    const matchedRange = PREDEFINED_RANGES.find((range) => {
      const preset = getDateRange(range);
      return (
        toISODate(preset.startDate) === valueStart &&
        toISODate(preset.endDate) === valueEnd
      );
    });

    if (matchedRange) {
      setActiveRange(matchedRange);
    } else {
      setActiveRange("Custom Range");
    }
  }, [value, getDateRange]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="form-input flex items-center gap-2 hover:border-primary-400 transition-colors bg-white"
        aria-label="Select date range"
        aria-expanded={isOpen}
      >
        <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" aria-hidden="true" />
        <span className="text-sm text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
          {formatDisplayValue()}
        </span>
      </button>

      {/* POPOVER */}
      {isOpen && (
        <>
          {/* Mobile Overlay */}
          {isMobile && showCustomPicker && (
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => {
                setIsOpen(false);
                setShowCustomPicker(false);
              }}
              aria-hidden="true"
            />
          )}

          <div
            className={`
              bg-white rounded-lg shadow-xl border border-gray-200 z-50
              ${
                isMobile && showCustomPicker
                  ? "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-md max-h-[90vh]"
                  : showCustomPicker
                    ? `absolute top-full mt-2 ${alignRight ? "right-0" : "left-0"} w-[840px] max-w-[95vw]`
                    : `absolute top-full mt-2 ${alignRight ? "right-0" : "left-0"} w-[240px]`
              }
              overflow-hidden
            `}
            role="dialog"
            aria-label="Date range picker"
          >
            {!showCustomPicker ? (
              // Simple range list
              <RangeList
                activeRange={activeRange}
                onSelect={handleRangeSelect}
                isMobile={isMobile}
              />
            ) : (
              // Custom date picker with calendar
              <div className="flex flex-col h-full max-h-[90vh]">
                {/* Mobile Header */}
                {isMobile && (
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Select Date Range
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        setShowCustomPicker(false);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5 text-gray-600" aria-hidden="true" />
                    </button>
                  </div>
                )}

                {/* Main content area */}
                <div
                  className={`flex ${isMobile ? "flex-col" : "flex-row"} flex-1 min-h-0`}
                >
                  {/* Sidebar */}
                  <div
                    className={`${isMobile ? "border-b" : "border-r w-[200px]"} border-gray-200 flex-shrink-0 ${isMobile ? "overflow-y-auto" : ""}`}
                  >
                    <div className="py-2">
                      <RangeList
                        activeRange={activeRange}
                        onSelect={handleRangeSelect}
                        isMobile={isMobile}
                      />
                    </div>
                  </div>

                  {/* Calendar container */}
                  <div className="flex-1 overflow-auto">
                    <div className={isMobile ? "p-2" : "p-0"}>
                      <DateRange
                        ranges={[tempRange]}
                        onChange={(item) => setTempRange({ ...item.selection, key: "selection" })}
                        months={isMobile ? 1 : 2}
                        direction={isMobile ? "vertical" : "horizontal"}
                        showDateDisplay={false}
                        rangeColors={["#fb923c"]}
                        moveRangeOnFirstSelection={false}
                        retainEndDateOnFirstSelection={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50 gap-4 flex-shrink-0">
                  <span className="text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap flex-1 min-w-0">
                    {formatDisplayValue(tempRange)}
                  </span>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleApply}
                      className="btn-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}