import React, { FC } from "react";
import { NumberInput } from "react-admin";
import {
  InputAdornment,
  TableContainer,
  Table,
  Paper as MuiPaper,
  TableRow,
  TableCell as MuiTableCell,
  TableBody,
  Typography,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/styles";
import { useForm, useFormState } from "react-final-form";

import { validateNumber, Totals } from "../InvoiceCreate";
import { ccyFormat } from "../../../utils";

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
  totals: Totals;
  updateTotals: (formData: any) => void;
}

export const TotalSection: FC<Props> = ({
  totals: {
    total_amount,
    discount_amount,
    net,
    gst_amount,
    grand_total,
    balance_due,
    credits_applied,
  },
  updateTotals,
}) => {
  const classes = useStyles();
  const form = useForm();
  const { values: formData } = useFormState();

  // TODO: update totals on update refresh
  // TODO: wrap text in Typography
  // ie. update on init, don't rely on initial data
  const handleDiscountRateOnBlur = () => {
    updateTotals(formData);
    form.change("discount_rate", ccyFormat(Number(formData.discount_rate)));
  };

  const handleGstRateOnBlur = () => {
    updateTotals(formData);
    form.change("gst_rate", ccyFormat(Number(formData.gst_rate)));
  };

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
                onBlur={handleDiscountRateOnBlur}
              />
            </TableCell>
            <TableCell align="right">
              (-) {ccyFormat(discount_amount)}
            </TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell colSpan={2}>Net</TableCell>
            <TableCell align="right">{ccyFormat(net)}</TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell>GST</TableCell>
            <TableCell align="right">
              <NumberInput
                source="gst_rate"
                resource="invoices"
                validate={validateNumber}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                onBlur={handleGstRateOnBlur}
              />
            </TableCell>
            <TableCell align="right">(+) {ccyFormat(gst_amount)}</TableCell>
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
          {credits_applied > 0 && (
            <>
              <TableRow hover>
                <TableCell colSpan={2}>Credits Applied</TableCell>
                <TableCell align="right">
                  (-) {ccyFormat(credits_applied)}
                </TableCell>
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
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
