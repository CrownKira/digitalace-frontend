export const statuses = [
  { id: "DFT", name: "resources.sales_orders.data.statuses.draft" },
  { id: "OP", name: "resources.announcements.data.statuses.open" },
];

export const getStatus = (optionValue: string) => {
  return (
    statuses.find((status) => status.id === optionValue)?.name ||
    "resources.sales_orders.data.statuses.draft"
  );
};

export const severities = [
  { id: "SUCC", name: "resources.sales_orders.data.severities.success" },
  { id: "INFO", name: "resources.announcements.data.severities.info" },
  { id: "WARN", name: "resources.announcements.data.severities.warning" },
  { id: "ERR", name: "resources.announcements.data.severities.error" },
];

export const getSeverity = (optionValue: string) => {
  switch (optionValue) {
    case "SUCC":
      return "success";
    case "INFO":
      return "info";
    case "WARN":
      return "warning";
    case "ERR":
      return "error";
    default:
      return "info";
  }
};
