import PaymentMethodIcon from "@material-ui/icons/PaymentTwoTone";

import { PaymentMethodList } from "./PaymentMethodList";
import { PaymentMethodCreate } from "./PaymentMethodCreate";
import { PaymentMethodEdit } from "./PaymentMethodEdit";

export const payment_methods = {
  codename: "paymentmethod",
  list: PaymentMethodList,
  create: PaymentMethodCreate,
  edit: PaymentMethodEdit,
  icon: PaymentMethodIcon,
};
