import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";
import "tippy.js/themes/light.css";

const Tooltip = ({
  position = "top",
  content,
  children,
  animation = "shift-away",
  delay = [100, 200],
  interactive = false,
  theme = "light",
  className = "",
  disabled = false,
}) => {
  if (!content || disabled) return children;

  return (
    <Tippy
      content={content}
      placement={position}
      animation={animation}
      delay={delay}
      interactive={interactive}
      theme={theme}
      arrow={true}
    >
      <span className={`inline-flex  ${className}`}>{children}</span>
    </Tippy>
  );
};

export default Tooltip;
