// ---------- TIME AGO ----------
export const timeAgo = (input) => {
  if (input == null) return "Just now";

  const date = new Date(input);
  if (isNaN(date.getTime())) return "Invalid date";

  const now = Date.now();
  let diff = Math.floor((now - date.getTime()) / 1000);

  if (diff <= 0) return "Just now";

  const units = [
    { label: "y", seconds: 60 * 60 * 24 * 365 },
    { label: "mo", seconds: 60 * 60 * 24 * 30 },
    { label: "d", seconds: 60 * 60 * 24 },
    { label: "h", seconds: 60 * 60 },
    { label: "m", seconds: 60 },
    { label: "s", seconds: 1 },
  ];

  for (const unit of units) {
    const value = Math.floor(diff / unit.seconds);
    if (value >= 1) {
      return `${value}${unit.label} ago`;
    }
  }

  return "Just now";
};

// ---------- FORMAT DATE ----------
export const formatDate = (input, type = "short") => {
  if (input == null) return "Not provided";

  const date = new Date(input);
  if (isNaN(date.getTime())) return "Invalid date";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[date.getMonth()];

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const isPM = hours >= 12;
  const hours12 = hours % 12 || 12;
  const meridian = isPM ? "PM" : "AM";

  switch (type) {
    case "short":
      return `${day}-${month}-${year}`;

    case "shortTime":
      return `${day}-${month}-${year} ${hours12}:${minutes} ${meridian}`;

    case "long":
      return `${day} ${monthName}, ${year}`;

    case "longTime":
      return `${day} ${monthName}, ${year} ${hours12}:${minutes} ${meridian}`;

    case "dayMonth":
      return `${day} ${monthName}`;

    case "time":
      return `${hours12}:${minutes} ${meridian}`;

    case "timeAgo":
      return timeAgo(input);

    default:
      return `${day}-${month}-${year}`;
  }
};

// ---------- DURATION BETWEEN TWO DATES ----------
export const formatDurationBetween = (
  start,
  end,
  type = "short" // short | long
) => {
  if (!start || !end) return null;

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return null;
  }

  const diffMs = endDate - startDate;
  if (diffMs <= 0) return null;

  const totalMinutes = Math.floor(diffMs / 60000);

  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (type === "long") {
    const parts = [];
    if (days) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
    if (hours) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
    if (minutes) parts.push(`${minutes} min${minutes !== 1 ? "s" : ""}`);
    return parts.join(" ");
  }

  // short format (default)
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

// ---------- INPUT FORMAT ----------
export const formatDateForInput = (dateString) => {
  if (dateString == null) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};


// ---------- FILE SAFE DATE FORMAT ----------
export const formatFileDate = (input) => {
  if (!input) return "unknown-date";

  const date = new Date(input);
  if (isNaN(date.getTime())) return "invalid-date";

  const day = String(date.getDate()).padStart(2, "0");

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};