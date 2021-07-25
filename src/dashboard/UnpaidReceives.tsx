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
import PaymentTwoToneIcon from "@material-ui/icons/PaymentTwoTone";
import { CardWithIcon } from "./CardWithIcon";
import { stringify } from "query-string";

import { Receive, Supplier } from "../types";
import { ccyFormat } from "../utils";

interface Props {
  receives?: Receive[];
  suppliers?: { [key: string]: Supplier };
  payables?: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: "350px",
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

export const UnpaidReceives: FC<Props> = ({
  receives = [],
  suppliers = {},
  payables = "",
}) => {
  const classes = useStyles();
  const translate = useTranslate();

  return (
    <CardWithIcon
      className={classes.root}
      to="/receives"
      icon={PaymentTwoToneIcon}
      title={translate("pos.dashboard.payables")}
      subtitle={payables}
    >
      <List dense={true}>
        {receives.map((record) => (
          <ListItem
            key={record.id}
            button
            component={Link}
            to={`/receives/${record.id}`}
          >
            <ListItemAvatar>
              {suppliers[record.supplier] ? (
                <Avatar
                  src={`${suppliers[record.supplier].image?.src}?size=32x32`}
                />
              ) : (
                <Avatar />
              )}
            </ListItemAvatar>
            <ListItemText
              primary={new Date(record.date).toLocaleString("en-GB", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              secondary={translate("pos.dashboard.receive.items", {
                smart_count: record.receiveitem_set?.length,
                nb_items: record.receiveitem_set?.length,
                supplier_name: suppliers[record.supplier]
                  ? `${suppliers[record.supplier].name}`
                  : "",
              })}
            />
            <ListItemSecondaryAction>
              <span className={classes.cost}>
                {ccyFormat(record.grand_total, true)}
              </span>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Box flexGrow="1">&nbsp;</Box>
      <Button
        className={classes.link}
        component={Link}
        to={{
          pathname: "/receives",
          search: stringify({
            filter: JSON.stringify({ status: "UPD" }),
          }),
        }}
        size="small"
        color="primary"
      >
        <Box p={1} className={classes.linkContent}>
          {translate("pos.dashboard.all_unpaid_receives")}
        </Box>
      </Button>
    </CardWithIcon>
  );
};
