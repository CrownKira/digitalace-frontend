import SalesOrderIcon from "@material-ui/icons/DescriptionTwoTone";

import { SalesOrderList } from "./SalesOrderList";
import { SalesOrderCreate } from "./SalesOrderCreate";
import { SalesOrderEdit } from "./SalesOrderEdit";

export const sales_orders = {
  codename: "salesorder",
  list: SalesOrderList,
  create: SalesOrderCreate,
  edit: SalesOrderEdit,
  icon: SalesOrderIcon,
};
