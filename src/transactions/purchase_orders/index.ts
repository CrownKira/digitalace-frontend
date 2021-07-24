import PurchaseOrderIcon from "@material-ui/icons/AttachMoneyTwoTone";

import { PurchaseOrderList } from "./PurchaseOrderList";
import { PurchaseOrderCreate } from "./PurchaseOrderCreate";
import { PurchaseOrderEdit } from "./PurchaseOrderEdit";

export const purchase_orders = {
  codename: "purchase_order",
  list: PurchaseOrderList,
  create: PurchaseOrderCreate,
  edit: PurchaseOrderEdit,
  icon: PurchaseOrderIcon,
};
