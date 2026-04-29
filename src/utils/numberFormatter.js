export function formatNumber(num, showRupee = false, decimals) {
  const parsed = Number(num);

  if (isNaN(parsed)) {
    return showRupee
      ? `₹${Number(0).toFixed(decimals)}`
      : Number(0).toFixed(decimals);
  }

  const formattedNumber = parsed.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return showRupee ? `₹${formattedNumber}` : formattedNumber;
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
