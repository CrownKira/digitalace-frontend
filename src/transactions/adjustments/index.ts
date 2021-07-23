import AdjustmentIcon from "@material-ui/icons/DescriptionTwoTone";

import { AdjustmentList } from "./AdjustmentList";
import { AdjustmentCreate } from "./AdjustmentCreate";
import { AdjustmentEdit } from "./AdjustmentEdit";

export const adjustments = {
  codename: "adjustment",
  list: AdjustmentList,
  create: AdjustmentCreate,
  edit: AdjustmentEdit,
  icon: AdjustmentIcon,
};
