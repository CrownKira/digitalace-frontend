import React, { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link, FieldProps, useTranslate, useQueryWithStore } from "react-admin";

import { AppState, SalesOrder, Product } from "../../../types";

const useStyles = makeStyles({
  rightAlignedCell: { textAlign: "right" },
});

export const Basket: FC<FieldProps<SalesOrder>> = ({ record }) => {
  const classes = useStyles();
  const translate = useTranslate();

  const { loaded, data: products } = useQueryWithStore<AppState>(
    {
      type: "getMany",
      resource: "products",
      payload: {
        ids: record
          ? record.salesorderitem_set.map((item) => item.product)
          : [],
      },
    },
    {},
    // TODO: remove this?
    (state) => {
      const productIds = record
        ? record.salesorderitem_set.map((item) => item.product)
        : [];

      return productIds
        .map<Product>(
          (productId) =>
            state.admin.resources.products.data[productId] as Product
        )
        .filter((r) => r !== undefined)
        .reduce((prev, next) => {
          prev[next.id] = next;
          return prev;
        }, {} as { [key: string]: Product });
    }
  );

  if (!loaded || !record) return null;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            {translate("resources.sales_order_items.fields.product")}
          </TableCell>
          <TableCell className={classes.rightAlignedCell}>
            {translate("resources.sales_order_items.fields.unit_price")}
          </TableCell>
          <TableCell className={classes.rightAlignedCell}>
            {translate("resources.sales_order_items.fields.quantity")}
          </TableCell>
          <TableCell className={classes.rightAlignedCell}>
            {translate("resources.sales_order_items.fields.amount")}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {record.salesorderitem_set.map(
          (item: any) =>
            products[item.product] && (
              <TableRow key={item.product}>
                <TableCell>
                  <Link to={`/products/${item.product}`}>
                    {products[item.product].name}
                  </Link>
                </TableCell>
                <TableCell className={classes.rightAlignedCell}>
                  {Number(item.unit_price).toLocaleString(undefined, {
                    style: "currency",
                    currency: "SGD",
                  })}
                </TableCell>
                <TableCell className={classes.rightAlignedCell}>
                  {item.quantity}
                </TableCell>
                <TableCell className={classes.rightAlignedCell}>
                  {item.amount}
                </TableCell>
              </TableRow>
            )
        )}
      </TableBody>
    </Table>
  );
};
