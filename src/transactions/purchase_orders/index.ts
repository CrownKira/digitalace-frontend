import PurchaseOrderIcon from "@material-ui/icons/Description";

import { PurchaseOrderList } from "./PurchaseOrderList";
import { PurchaseOrderCreate } from "./PurchaseOrderCreate";
import { PurchaseOrderEdit } from "./PurchaseOrderEdit";

export const invoices = {
  codename: "invoice",
  list: PurchaseOrderList,
  create: PurchaseOrderCreate,
  edit: PurchaseOrderEdit,
  icon: PurchaseOrderIcon,
};
