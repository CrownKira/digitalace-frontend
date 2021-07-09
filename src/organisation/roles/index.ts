import RoleIcon from "@material-ui/icons/DirectionsWalk";

import { RoleList } from "./RoleList";
import { RoleEdit } from "./RoleEdit";
import { RoleCreate } from "./RoleCreate";

export const roles = {
  codename: "role",
  list: RoleList,
  create: RoleCreate,
  edit: RoleEdit,
  icon: RoleIcon,
};
