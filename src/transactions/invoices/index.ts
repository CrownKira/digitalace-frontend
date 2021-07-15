import InvoiceIcon from "@material-ui/icons/DescriptionTwoTone";

import { InvoiceList } from "./InvoiceList";
import { InvoiceCreate } from "./InvoiceCreate";
import { InvoiceEdit } from "./InvoiceEdit";

export const invoices = {
  codename: "invoice",
  list: InvoiceList,
  create: InvoiceCreate,
  edit: InvoiceEdit,
  icon: InvoiceIcon,
};
