import DepartmentIcon from "@material-ui/icons/Domain";

import { DepartmentList } from "./DepartmentList";
import { DepartmentEdit } from "./DepartmentEdit";
import { DepartmentCreate } from "./DepartmentCreate";

export const departments = {
  codename: "department",
  list: DepartmentList,
  create: DepartmentCreate,
  edit: DepartmentEdit,
  icon: DepartmentIcon,
};