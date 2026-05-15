const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return "badge-success";
    case "success":
      return "badge-success";
    case "pending":
      return "badge-warning";
    case "rejected":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};

const test = (t) => {
  switch (t) {
    case "approved":
      return "bg-warning";
    case "rejected":
      return "bg-info"

  }
}

const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleString("en-GB", {
    timeZone: "Asia/Bahrain",
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formattedAmount = (amount) => {
  const formatted = new Intl.NumberFormat("en-BH", {
    minimumFractionDigits: 3,
  }).format(amount);
  return formatted;
};

 const ibanFormat = (str) => {
    return str.replace(/.{4}(?!$)/g, "$& ");
  };

export { getStatusColor, formatDate, formattedAmount, ibanFormat, test };
