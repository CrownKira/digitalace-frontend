import React, { FC } from "react";
import { List, ListProps, SimpleList } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({});

export const PaymentMethodList: FC<ListProps> = (props) => (
  <List {...props}>
    <SimpleList primaryText={(record) => record.name} />
  </List>
);

/*
TODO: link to related invoices

<LinkToRelatedProducts record={data[id]} />
*/
