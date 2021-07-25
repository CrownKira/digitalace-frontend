import React, { FC } from "react";
import DollarIcon from "@material-ui/icons/AttachMoneyTwoTone";
import { useTranslate } from "react-admin";

import { CardWithIcon } from "./CardWithIcon";

interface Props {
  value?: string;
}

export const MonthlyRevenue: FC<Props> = ({ value }) => {
  const translate = useTranslate();

  return (
    <CardWithIcon
      to="/invoices"
      icon={DollarIcon}
      title={translate("pos.dashboard.monthly_revenue")}
      subtitle={value}
    />
  );
};
