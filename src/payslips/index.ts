import PayslipIcon from "@material-ui/icons/ReceiptTwoTone";

import { PayslipList } from "./PayslipList";
import { PayslipCreate } from "./PayslipCreate";
import { PayslipEdit } from "./PayslipEdit";

export const payslips = {
  codename: "payslip",
  list: PayslipList,
  create: PayslipCreate,
  edit: PayslipEdit,
  icon: PayslipIcon,
};
