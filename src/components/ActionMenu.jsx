import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Ellipsis, Loader2, MoreVertical } from "lucide-react";
import { getActionColor } from "../utils/actionColors";

const ActionMenu = ({
  items = [],
  loading = false,
  disabled = false,
  width = "w-52",
}) => {
  const getColorStyle = (color) => getActionColor(color);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton
        aria-label="Open actions menu"
        disabled={disabled}
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <MoreVertical className="w-4 h-4" />
        )}
      </MenuButton>

      <MenuItems
        anchor="bottom end"
        className={`${width} origin-top-right rounded-md border border-slate-200 bg-white shadow-lg focus:outline-none z-[9999]`}
      >
        {items.map((item, index) => {
          const color = getColorStyle(item.color);

          return (
            <MenuItem key={index} disabled={item.disabled}>
              {({ active, disabled }) => (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onClick?.();
                  }}
                  disabled={disabled}
                  className={`flex w-full items-center gap-2  px-3 py-2 text-sm transition ${
                    disabled
                      ? "text-slate-400 cursor-not-allowed"
                      : active
                        ? color.menu + " bg-opacity-20"
                        : color.menu
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </button>
              )}
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
};

export default ActionMenu;
