import React from "react";
import { ChevronDown, ChevronsUpDown, ChevronUp, Loader2 } from "lucide-react";
import { formatNumber } from "../utils/numberFormatter";
import NoDataFound from "../layout/NoDataFound";
import Shimmer from "../layout/Shimmer";
import ActionMenu from "./ActionMenu";
import { getActionColor } from "../utils/actionColors";
import { useSelector } from "react-redux";
import { hasAccess } from "../utils/accessControl";

export default function SmartTable({
  title,
  totalcount,
  data = [],
  columns = [],
  actions = [],
  emptyMessage = "No data found",
  emptyDescription = "",
  onRowClick,
  isRowDisabled,
  disabledRowRenderer,
  loading = false,

  sortField,
  sortDirection, // "asc" | "desc"
  onSortChange,

  selectable = false,
  selectedRows = [],
  onSelectionChange,
  rowKey = "id",

  expandable = false,
  renderExpandedRow,
  expandOnRowClick = false,

  showSr = false, // default off
  currentPage,
  pageSize,
}) {
  const { meData } = useSelector((state) => state.auth);

  const visibleActions = React.useMemo(() => {
    if (!meData) return [];

    return actions.filter((action) => {
      if (!action.roles && !action.permissions) return true;

      return hasAccess({
        userRole: meData.roles?.[0]?.slug,
        userPermissions: meData.permissions,
        roles: action.roles,
        permissions: action.permissions,
      });
    });
  }, [actions, meData]);

  const columnCount =
    (showSr ? 1 : 0) +
    (selectable ? 1 : 0) +
    columns.length +
    (visibleActions.length > 0 ? 1 : 0) +
    (expandable ? 1 : 0);

  const [expandedRows, setExpandedRows] = React.useState(() => new Set());

  const toggleRow = (rowId) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(rowId) ? next.delete(rowId) : next.add(rowId);
      return next;
    });
  };

  const handleSort = (col) => {
    if (!col.sortable || !onSortChange) return;

    const field = col.sortKey || col.key;
    let nextDirection = "asc";

    if (sortField === field) {
      nextDirection = sortDirection === "asc" ? "desc" : "asc";
    }

    onSortChange(field, nextDirection);
  };

  const getRowValue = (row) => {
    if (!row || row[rowKey] === undefined) {
      console.warn(`SmartTable: rowKey "${rowKey}" not found in row`, row);
      return undefined;
    }
    return row[rowKey];
  };

  const isRowSelected = (row) => selectedRows.includes(getRowValue(row));

  const toggleRowSelection = (row) => {
    if (!onSelectionChange) return;

    const value = getRowValue(row);

    if (selectedRows.includes(value)) {
      onSelectionChange(selectedRows.filter((v) => v !== value));
    } else {
      onSelectionChange([...selectedRows, value]);
    }
  };

  const toggleSelectAll = () => {
    if (!onSelectionChange) return;

    const allValues = data.map(getRowValue);
    const allSelected = allValues.every((v) => selectedRows.includes(v));

    onSelectionChange(allSelected ? [] : allValues);
  };

  return (
    <div className="bg-white overflow-hidden border-none">
      {/* Header Section - Only show if title is provided */}
      {title && typeof totalcount === "number" && (
        <div className="px-6 py-4 border-b border-slate-200 bg-white">
          <div className="text-lg font-semibold text-slate-900 whitespace-nowrap">
            {title}{" "}
            <span className="text-slate-500 font-normal">
              · {formatNumber(totalcount)} entries
            </span>
          </div>
        </div>
      )}

      <div className="relative w-full overflow-x-auto">
        <table className="w-full text-sm ">
          {/* <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
              {columns.map((col, idx) => (
                <th key={idx} className="px-3 py-3">
                  {col.label}
                </th>
              ))}
              {visibleActions?.length > 0 && (
                <th className="px-3 py-3 text-right">Actions</th>
              )}
            </tr>
          </thead> */}

          <thead className="bg-grey-100 border-b border-slate-200">
            <tr className="text-left text-xs font-semibold tracking-wide text-slate-700">
              {selectable && (
                <th className="px-6 py-3 w-10">
                  <input
                    type="checkbox"
                    disabled={loading}
                    checked={
                      data.length > 0 &&
                      data.every((row) =>
                        selectedRows.includes(getRowValue(row)),
                      )
                    }
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 accent-blue-600 cursor-pointer"
                  />
                </th>
              )}
              {showSr && <th className="px-6 py-3 w-14">Sr</th>}

              {columns.map((col, idx) => {
                const field = col.sortKey || col.key;
                const isActive = sortField === field;

                return (
                  <th
                    key={idx}
                    onClick={() => col.sortable && handleSort(col)}
                    className={`
                      group relative px-6 py-3 whitespace-nowrap select-none
                      transition-colors duration-150 ease-out
                      ${
                        col.sortable
                          ? "cursor-pointer hover:text-slate-900"
                          : ""
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-slate-700">{col.label}</span>

                      {col.sortable && (
                        <span className="flex items-center">
                          {isActive ? (
                            sortDirection === "asc" ? (
                              <ChevronUp className="h-3.5 w-3.5 text-slate-800" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-slate-800" />
                            )
                          ) : (
                            <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}

              {visibleActions?.length > 0 && (
                <th className="px-6 py-3 text-right text-slate-700">Actions</th>
              )}

              {expandable && <th className="w-10 px-6" />}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {loading ? (
              [...Array(5)].map((_, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="bg-white hover:bg-slate-50/50 transition-colors"
                >
                  {selectable && (
                    <td className="px-6 py-4">
                      <div
                        className={`h-4 w-4 rounded bg-slate-200 animate-pulse`}
                      />
                    </td>
                  )}

                  {showSr && (
                    <td className="px-6 py-4 w-14">
                      <Shimmer />
                    </td>
                  )}

                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      <Shimmer width="80%" height="16px" />
                    </td>
                  ))}

                  {visibleActions?.length > 0 && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {visibleActions.map((_, aIdx) => (
                          <div
                            key={aIdx}
                            className="
                            h-8 w-8 rounded-lg
                            bg-slate-100
                            ring-1 ring-inset ring-slate-200
                            animate-pulse
                          "
                          />
                        ))}
                      </div>
                    </td>
                  )}
                  {expandable && (
                    <td className="px-6 py-4">
                      <div className="h-4 w-4 rounded bg-slate-200 animate-pulse" />
                    </td>
                  )}
                </tr>
              ))
            ) : data?.length > 0 ? (
              data?.map((row, idx) => {
                const isDisabled =
                  typeof isRowDisabled === "function" && isRowDisabled(row);

                // 🔴 DISABLED ROW (FULL WIDTH, NO ACTIONS)
                if (isDisabled && typeof disabledRowRenderer === "function") {
                  return (
                    <tr
                      key={getRowValue(row) ?? idx}
                      className="border-t border-red-200 bg-red-50"
                    >
                      <td colSpan={columnCount} className="px-4 py-4">
                        {disabledRowRenderer(row)}
                      </td>
                    </tr>
                  );
                }
                return (
                    <React.Fragment key={getRowValue(row) ?? idx}>
                    <tr
                      onClick={() => {
                        if (expandable && expandOnRowClick) {
                          toggleRow(row.id || idx);
                        } else {
                          onRowClick?.(row);
                        }
                      }}
                      className={`bg-white border-b border-slate-200 transition-all duration-200
                        ${
                          onRowClick
                            ? "cursor-pointer hover:bg-slate-50"
                            : "hover:bg-slate-50"
                        }
                      `}
                    >
                      {selectable && (
                        <td className="px-6 py-3">
                          <input
                            type="checkbox"
                            checked={isRowSelected(row)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleRowSelection(row);
                            }}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
                          />
                        </td>
                      )}

                      {showSr && (
                        <td className="px-6 py-3">
                          {(() => {
                            const sr =
                              currentPage && pageSize
                                ? (currentPage - 1) * pageSize + (idx + 1)
                                : idx + 1;

                            return (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold text-slate-500">
                                {sr}
                              </span>
                            );
                          })()}
                        </td>
                      )}

                      {columns?.map((col, colIdx) => (
                        <td key={colIdx} className="px-6 py-3 text-slate-900">
                          {col.render ? col.render(row, idx) : row[col.key]}
                        </td>
                      ))}

                      {visibleActions?.length > 0 && (
                        <td className="px-6 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            {visibleActions.map((action, actionIndex) => {
                              /* ================================
     🔹 ACTION MENU (submenu)
  ================================= */
                              if (Array.isArray(action.items)) {
                                const menuItems = action.items.map((item) => ({
                                  ...item,
                                  disabled:
                                    typeof item.disabled === "function"
                                      ? item.disabled(row)
                                      : Boolean(item.disabled),
                                  loading:
                                    typeof item.loading === "function"
                                      ? item.loading(row)
                                      : Boolean(item.loading),
                                  onClick: () => item.onClick?.(row),
                                }));

                                const menuLoading = menuItems.some(
                                  (i) => i.loading,
                                );
                                const menuDisabled =
                                  menuLoading ||
                                  menuItems.every((i) => i.disabled);

                                return (
                                  <ActionMenu
                                    key={action.label}
                                    items={menuItems}
                                    loading={menuLoading}
                                    disabled={menuDisabled}
                                  />
                                );
                              }

                              /* ================================
     🔹 NORMAL ICON ACTION
  ================================= */

                              const isDisabled =
                                typeof action.disabled === "function"
                                  ? action.disabled(row)
                                  : Boolean(action.disabled);

                              const isLoading =
                                typeof action.loading === "function"
                                  ? action.loading(row)
                                  : Boolean(action.loading);

                              const Icon =
                                typeof action.icon === "function"
                                  ? action.icon(row)
                                  : action.icon;

                              const isButtonDisabled = isDisabled || isLoading;

                              const palette = getActionColor(action.color);

                              const disabledTooltipText =
                                isButtonDisabled && action.disabledTooltip
                                  ? typeof action.disabledTooltip === "function"
                                    ? action.disabledTooltip(row)
                                    : action.disabledTooltip
                                  : "";

                              return (
                                <button
                                  key={`${action.label}-${actionIndex}`}
                                  type="button"
                                  title={
                                    disabledTooltipText || action.label || ""
                                  }
                                  aria-label={action.label || ""}
                                  disabled={isButtonDisabled}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isButtonDisabled) {
                                      action.onClick?.(row);
                                    }
                                  }}
                                  className={`
                                    group inline-grid h-8 w-8 place-items-center rounded-lg
                                    transition-all duration-200
                                    ${
                                      isButtonDisabled
                                        ? "cursor-not-allowed opacity-50 text-slate-400"
                                        : `${palette.icon} hover:ring-1 hover:scale-[1.03]`
                                    }
                                  `}
                                >
                                  {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    Icon && <Icon className="h-4 w-4" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      )}

                      {expandable && (
                        <td
                          className="px-6 py-3 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRow(row.id || idx);
                          }}
                        >
                          <div className="flex items-center justify-center text-slate-400">
                            {expandedRows.has(row.id || idx) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                    {expandable &&
                      expandedRows.has(row.id || idx) &&
                      typeof renderExpandedRow === "function" && (
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <td colSpan={columnCount} className="px-6 py-4">
                            {renderExpandedRow(row)}
                          </td>
                        </tr>
                      )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td className="px-3 py-12" colSpan={columnCount}>
                  <NoDataFound
                    title={emptyMessage}
                    description={emptyDescription}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
