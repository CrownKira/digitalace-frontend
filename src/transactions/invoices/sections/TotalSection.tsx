import React, { FC, useMemo, useEffect, useCallback } from "react";
import {
  NumberInput,
  FormDataConsumer,
  ReferenceField,
  Labeled,
} from "react-admin";
import {
  Box,
  InputAdornment,
  TableContainer,
  Table,
  Paper as MuiPaper,
  TableHead,
  TableRow,
  TableCell as MuiTableCell,
  TableBody,
  Typography,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/styles";
import RichTextInput from "ra-input-rich-text";
import { useForm, useFormState } from "react-final-form";

import { CreditsAppliedInput } from "../fields/CreditsAppliedInput";
import { validateNumber } from "../InvoiceCreate";
import { PriceField } from "../../../utils/components/PriceField";
import { toFixedNumber } from "../../../utils";
import { InvoiceItem } from "../../../types";

// const TAX_RATE = 0.07;

const useStyles = makeStyles({
  table: {
    minWidth: 450,
  },
});

const TableCell = withStyles({
  root: {
    borderBottom: "none",
  },
})(MuiTableCell);

const Paper = withStyles({
  root: {
    border: "none",
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
})(MuiPaper);

interface Props {
  // formProps: any;
}

const ccyFormat = (num: number) => `${num.toFixed(2)}`;

export const TotalSection: FC<Props> = () => {
  const classes = useStyles();
  const form = useForm();
  const { values: formData } = useFormState();

  const isBlur = useCallback(
    (field: string) => {
      return form.getFieldState(field)?.active === false;
    },
    [form]
  );

  const lineItems = useMemo(
    () =>
      formData.invoiceitem_set
        ? (formData.invoiceitem_set as InvoiceItem[]).map((lineItem) => {
            const quantity = lineItem ? toFixedNumber(lineItem.quantity, 0) : 0;

            const unitPrice = lineItem
              ? toFixedNumber(lineItem.unit_price, 2)
              : 0;

            const amount = quantity * unitPrice;

            return {
              quantity,
              unit_price: unitPrice,
              amount,
            };
          })
        : [],
    [formData.invoiceitem_set]
  );
  const amounts = useMemo(
    () => lineItems.map((lineItem) => lineItem.amount),
    [lineItems]
  );
  const discount_rate = useMemo(
    () => toFixedNumber(formData.discount_rate, 2),
    [formData.discount_rate]
  );
  const gst_rate = useMemo(
    () => toFixedNumber(formData.gst_rate, 2),
    [formData.gst_rate]
  );
  const credits_applied = useMemo(
    () => toFixedNumber(formData.credits_applied, 2),
    [formData.credits_applied]
  );

  // FIXME: amount to credit rounding
  useEffect(() => {
    form.batch(() => {
      // TODO: use useField() instead?
      if (isBlur("discount_rate")) {
        form.change("discount_rate", ccyFormat(discount_rate));
      }

      if (isBlur("gst_rate")) {
        form.change("gst_rate", ccyFormat(gst_rate));
      }

      lineItems.forEach(({ quantity, unit_price, amount }, index) => {
        const source1 = `invoiceitem_set[${index}].quantity`;
        if (isBlur(source1)) {
          form.change(source1, quantity.toFixed());
        }

        const source2 = `invoiceitem_set[${index}].unit_price`;
        if (isBlur(source2)) {
          form.change(source2, ccyFormat(unit_price));
        }

        const source3 = `invoiceitem_set[${index}].amount`;
        if (isBlur(source3)) {
          form.change(source3, ccyFormat(amount));
        }
      });
    });
  }, [discount_rate, form, gst_rate, isBlur, lineItems]);

  const total_amount = useMemo(
    () => amounts.reduce((x: number, y: number) => x + y, 0),
    [amounts]
  );

  // toFixedNumber: returns rounded number that can be used for numeric operations
  // round the rest only at the end of calculation for display
  const discount_amount = useMemo(
    () => total_amount * (discount_rate / 100),
    [total_amount, discount_rate]
  );
  const net = useMemo(
    () => total_amount * (1 - discount_rate / 100),
    [total_amount, discount_rate]
  );
  const gst_amount = useMemo(() => net * (gst_rate / 100), [net, gst_rate]);
  const grand_total = useMemo(
    () => net * (1 + gst_rate / 100),
    [net, gst_rate]
  );
  const balance_due = useMemo(
    () => grand_total - credits_applied,
    [grand_total, credits_applied]
  );

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="summary table">
        <TableBody>
          <TableRow hover>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">{ccyFormat(total_amount)}</TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell>Discount</TableCell>
            <TableCell align="right">
              <NumberInput
                source="discount_rate"
                resource="invoices"
                validate={validateNumber}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      // qn: is this redundant?
                      position="end"
                    >
                      %
                    </InputAdornment>
                  ),
                }}
              />
            </TableCell>
            <TableCell align="right">{ccyFormat(discount_amount)}</TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell colSpan={2}>Net</TableCell>
            <TableCell align="right">{ccyFormat(net)}</TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell>GST</TableCell>
            <TableCell align="right">
              {" "}
              <NumberInput
                source="gst_rate"
                resource="invoices"
                validate={validateNumber}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
            </TableCell>
            <TableCell align="right">{ccyFormat(gst_amount)}</TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell colSpan={2}>
              <Typography variant="h6" gutterBottom>
                Grand Total (SGD)
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="h6" gutterBottom>
                {ccyFormat(grand_total)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell colSpan={2}>Credits Applied</TableCell>
            <TableCell align="right">{ccyFormat(credits_applied)}</TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell colSpan={2}>
              <Typography variant="h6" gutterBottom>
                Balance Due (SGD)
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="h6" gutterBottom>
                {ccyFormat(balance_due)}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
