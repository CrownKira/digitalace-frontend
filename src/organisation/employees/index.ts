import EmployeeIcon from "@material-ui/icons/PeopleTwoTone";

import { EmployeeList } from "./EmployeeList";
import { EmployeeCreate } from "./EmployeeCreate";
import { EmployeeEdit } from "./EmployeeEdit";

export const employees = {
  codename: "user",
  list: EmployeeList,
  create: EmployeeCreate,
  edit: EmployeeEdit,
  icon: EmployeeIcon,
};
