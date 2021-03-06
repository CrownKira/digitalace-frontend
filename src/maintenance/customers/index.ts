import CustomerIcon from "@material-ui/icons/PeopleTwoTone";

import { CustomerList } from "./CustomerList";
import { CustomerCreate } from "./CustomerCreate";
import { CustomerEdit } from "./CustomerEdit";

export const customers = {
  codename: "customer",
  list: CustomerList,
  create: CustomerCreate,
  edit: CustomerEdit,
  icon: CustomerIcon,
};
