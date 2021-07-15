import PurchaseOrderIcon from "@material-ui/icons/DescriptionTwoTone";

import { PurchaseOrderList } from "./PurchaseOrderList";
import { PurchaseOrderCreate } from "./PurchaseOrderCreate";
import { PurchaseOrderEdit } from "./PurchaseOrderEdit";

export const purchase_orders = {
  codename: "purchaseorder",
  list: PurchaseOrderList,
  create: PurchaseOrderCreate,
  edit: PurchaseOrderEdit,
  icon: PurchaseOrderIcon,
};
