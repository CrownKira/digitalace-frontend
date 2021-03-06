import React, { FC } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import {
  useShowController,
  FieldProps,
  ReferenceField,
  TextField,
} from "react-admin";

import { Basket } from "./sections/Basket";
import { Invoice, Customer } from "../../types";

const CustomerField: FC<FieldProps<Customer>> = ({ record }) =>
  record ? (
    <Typography>
      {record.first_name} {record.last_name}
      <br />
      {record.address}
      <br />
      {record.city}
      {record.zipcode ? `, ${record.zipcode}` : ""}
    </Typography>
  ) : null;

export const InvoiceShow = (props: any) => {
  const { record } = useShowController<Invoice>(props);
  const classes = useStyles();

  if (!record) return null;

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom>
              {record.company_name}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom align="right">
              Invoice {record.reference}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} container alignContent="flex-end">
            <ReferenceField
              reference="customers"
              resource="invoices"
              source="customer"
              link={false}
              basePath="/invoices"
              record={record}
            >
              <CustomerField />
            </ReferenceField>
          </Grid>
        </Grid>
        <div className={classes.spacer}>&nbsp;</div>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom align="center">
              Date{" "}
            </Typography>
            <Typography gutterBottom align="center">
              {new Date(record.date).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h6" gutterBottom align="center">
              Sales Order
            </Typography>
            <ReferenceField
              reference="sales_orders"
              resource="sales_orders"
              source="sales_order"
              basePath="/sales_orders"
              record={record}
            >
              <TextField
                source="reference"
                align="center"
                component="p"
                gutterBottom
              />
            </ReferenceField>
          </Grid>
        </Grid>
        <div className={classes.invoices}>
          <Basket record={record} />
        </div>
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles({
  root: { width: 600, margin: "auto" },
  spacer: { height: 20 },
  invoices: { margin: "10px 0" },
});
