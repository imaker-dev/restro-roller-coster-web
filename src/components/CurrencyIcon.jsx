import React from "react";
import { CURRENCY } from "../constants";

const CurrencyIcon = ({
  size = 14,
  className = "",
  ...props
}) => {
  const Icon = CURRENCY.ICON;

  return (
    <Icon
      size={size}
      className={className}
      {...props}
    />
  );
};

export default CurrencyIcon;