import { useState, useEffect } from "react";

function SidebarLinkGroup({
  children,
  activecondition,
  sidebarExpanded = true,
}) {
  const [open, setOpen] = useState(activecondition);

  // keep submenu open if route active
  useEffect(() => {
    setOpen(activecondition);
  }, [activecondition]);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <li
      className={`relative mb-0.5 last:mb-0 font-semibold ${
        sidebarExpanded
          ? " rounded-md"
          : " rounded-lg mx-1 hover:bg-gray-100 transition-colors duration-200"
      }`}
    >
      {children(handleClick, open)}
    </li>
  );
}

export default SidebarLinkGroup;
