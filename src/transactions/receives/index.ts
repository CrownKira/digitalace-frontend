import ReceiveIcon from "@material-ui/icons/Description";

import { ReceiveList } from "./ReceiveList";
import { ReceiveCreate } from "./ReceiveCreate";
import { ReceiveEdit } from "./ReceiveEdit";

export const invoices = {
  codename: "invoice",
  list: ReceiveList,
  create: ReceiveCreate,
  edit: ReceiveEdit,
  icon: ReceiveIcon,
};
