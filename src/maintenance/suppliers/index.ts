import SupplierIcon from "@material-ui/icons/People";

import { SupplierList } from "./SupplierList";
import { SupplierCreate } from "./SupplierCreate";
import { SupplierEdit } from "./SupplierEdit";

export const suppliers = {
  codename: "supplier",
  list: SupplierList,
  create: SupplierCreate,
  edit: SupplierEdit,
  icon: SupplierIcon,
};
