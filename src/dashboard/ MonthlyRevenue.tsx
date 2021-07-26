import React, { FC } from "react";
import DollarIcon from "@material-ui/icons/AttachMoneyTwoTone";
import { useTranslate } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";

import { CardWithIcon } from "./CardWithIcon";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: "250px",
  },
}));

interface Props {
  value?: string;
}

export const MonthlyRevenue: FC<Props> = ({ value }) => {
  const classes = useStyles();
  const translate = useTranslate();

  return (
    <CardWithIcon
      className={classes.root}
      to="/invoices"
      icon={DollarIcon}
      title={translate("pos.dashboard.monthly_revenue")}
      subtitle={value}
    />
  );
};
