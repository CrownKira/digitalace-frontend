import React, { FC } from "react";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCartTwoTone";
import { useTranslate } from "react-admin";
import { stringify } from "query-string";
import { subDays } from "date-fns";

import { CardWithIcon } from "./CardWithIcon";
import { dateFormatter } from "../utils";

interface Props {
  value?: number;
}

export const NbNewInvoices: FC<Props> = ({ value }) => {
  const translate = useTranslate();
  const aMonthAgo = subDays(new Date(), 30);

  return (
    <CardWithIcon
      to={{
        pathname: "/invoices",
        search: stringify({
          filter: JSON.stringify({ date__gte: dateFormatter(aMonthAgo) }),
        }),
      }}
      icon={ShoppingCartIcon}
      title={translate("pos.dashboard.new_invoices")}
      subtitle={value}
    />
  );
};
