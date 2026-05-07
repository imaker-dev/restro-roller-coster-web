import { CURRENCY } from "../constants";

export function formatNumber(num, showCurrency = false, decimals = null) {
  const parsed = Number(num);

  const safeNumber = isNaN(parsed) ? 0 : parsed;

  const options = {};

  // Apply decimals only if explicitly passed
  if (decimals !== null) {
    options.minimumFractionDigits = decimals;
    options.maximumFractionDigits = decimals;
  }

  if (showCurrency) {
    return new Intl.NumberFormat(CURRENCY.LOCALE || "en-IN", {
      style: "currency",
      currency: CURRENCY.CODE || "INR",
      ...options,
    }).format(safeNumber);
  }

  return new Intl.NumberFormat(CURRENCY.LOCALE || "en-IN", options).format(
    safeNumber,
  );
}

// Safe number conversion
export const num = (value) => {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
};

// Calculate percentage
export function pct(value, total, options = {}) {
  const {
    decimals = 1,
    suffix = true,
    clamp = false,
    asNumber = false,
  } = options;

  const val = num(value);
  const tot = num(total);

  if (!tot) {
    const zero = Number(0).toFixed(decimals);
    return asNumber ? Number(zero) : suffix ? `${zero}%` : zero;
  }

  let percentage = (val / tot) * 100;

  if (clamp) {
    percentage = Math.min(Math.max(percentage, 0), 100);
  }

  const fixed = percentage.toFixed(decimals);

  if (asNumber) return Number(fixed);

  return suffix ? `${fixed}%` : fixed;
}
