export const ORDER_STATUSES = {
  pending: {
    label: "Pending",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    dotColor: "bg-amber-500",
    borderColor: "border-amber-200",
  },
  preparing: {
    label: "Preparing",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    dotColor: "bg-blue-500",
    borderColor: "border-blue-200",
  },
  ready: {
    label: "Ready",
    color: "text-green-600",
    bgColor: "bg-green-50",
    dotColor: "bg-green-500",
    borderColor: "border-green-200",
  },
  served: {
    label: "Served",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    dotColor: "bg-purple-500",
    borderColor: "border-purple-200",
  },

  cancelled: {
    label: "Cancelled",
    color: "text-red-600",
    bgColor: "bg-red-50",
    dotColor: "bg-red-500",
    borderColor: "border-red-200",
  },
};

export const STATUS_FLOW = ["pending", "preparing", "ready"]; // "served"
