import React, { FC } from "react";
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { useTranslate } from "react-admin";
import AttachMoneyTwoToneIcon from "@material-ui/icons/AttachMoneyTwoTone";
import { CardWithIcon } from "./CardWithIcon";
import { stringify } from "query-string";

import { Invoice, Customer } from "../types";

interface Props {
  invoices?: Invoice[];
  customers?: { [key: string]: Customer };
  receivables?: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
  },
  cost: {
    marginRight: "1em",
    color: theme.palette.text.primary,
  },
  link: {
    borderRadius: 0,
  },
  linkContent: {
    color: theme.palette.primary.main,
  },
}));

export const UnpaidInvoices: FC<Props> = ({
  invoices = [],
  customers = {},
  receivables = "",
}) => {
  const classes = useStyles();
  const translate = useTranslate();

  return (
    <CardWithIcon
      // className={classes.root}
      to="/invoices"
      icon={AttachMoneyTwoToneIcon}
      title={translate("pos.dashboard.receivables")}
      subtitle={receivables}
    >
      <List dense={true}>
        {invoices.map((record) => (
          <ListItem
            key={record.id}
            button
            component={Link}
            to={`/invoices/${record.id}`}
          >
            <ListItemAvatar>
              {customers[record.customer] ? (
                <Avatar
                  src={`${customers[record.customer].image?.src}?size=32x32`}
                />
              ) : (
                <Avatar />
              )}
            </ListItemAvatar>
            <ListItemText
              primary={new Date(record.date).toLocaleString("en-GB")}
              secondary={translate("pos.dashboard.invoice.items", {
                smart_count: record.invoiceitem_set?.length,
                nb_items: record.invoiceitem_set?.length,
                customer_name: customers[record.customer]
                  ? `${customers[record.customer].name}`
                  : "",
              })}
            />
            <ListItemSecondaryAction>
              <span className={classes.cost}>{record.grand_total}S$</span>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Box flexGrow="1">&nbsp;</Box>
      <Button
        className={classes.link}
        component={Link}
        to={{
          pathname: "/invoices",
          search: stringify({
            filter: JSON.stringify({ status: "UPD" }),
          }),
        }}
        size="small"
        color="primary"
      >
        <Box p={1} className={classes.linkContent}>
          {translate("pos.dashboard.all_unpaid_invoices")}
        </Box>
      </Button>
    </CardWithIcon>
  );
};
