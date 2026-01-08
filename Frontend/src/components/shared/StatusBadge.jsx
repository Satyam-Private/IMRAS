export function StatusBadge({ status, type = "status" }) {
  const getStatusStyle = () => {
    if (type === "priority") {
      switch (status) {
        case "high":
          return "bg-red-100 text-red-700";
        case "medium":
          return "bg-amber-100 text-amber-700";
        case "low":
          return "bg-blue-100 text-blue-700";
        default:
          return "bg-slate-100 text-slate-700";
      }
    }

    if (type === "stock") {
      switch (status) {
        case "in_stock":
          return "bg-green-100 text-green-700";
        case "low_stock":
          return "bg-amber-100 text-amber-700";
        case "out_of_stock":
          return "bg-red-100 text-red-700";
        case "overstock":
          return "bg-purple-100 text-purple-700";
        default:
          return "bg-slate-100 text-slate-700";
      }
    }

    // Default status type
    switch (status) {
      case "completed":
      case "approved":
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
      case "draft":
        return "bg-amber-100 text-amber-700";
      case "in_progress":
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
      case "rejected":
      case "inactive":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusLabel = () => {
    if (!status && status !== 0) return "";
    return String(status)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        h-5 px-2
        text-xs leading-none
        rounded
        ${getStatusStyle()}
      `}
    >
      {getStatusLabel()}
    </span>
  );
}
