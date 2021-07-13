import React, { FC, useMemo } from "react";
import {
  Box,
  TableContainer,
  Table,
  Paper as MuiPaper,
  TableRow,
  TableCell as MuiTableCell,
  TableBody,
  Typography,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/styles";
import { Record, useRecordContext } from "react-admin";
import { useFormState } from "react-final-form";

import { toFixedNumber } from "../../../utils";

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
});

interface Props {
  // formData: any;
  // record: Record;
  totalCredits: {
    total_amount_to_credit: number;
    balance_due: number;
  };
}

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

export const TotalCreditsSection: FC<Props> = ({
  totalCredits: { total_amount_to_credit, balance_due },
}) => {
  const record = useRecordContext();
  const { values: formData } = useFormState();
  // useFormState();

  const classes = useStyles();

  // const total_amount_to_credit = useMemo(
  //   () => formData.credits_applied - (record?.credits_applied || 0),
  //   [formData.credits_applied, record]
  // );
  // const balance_due = useMemo(
  //   () =>
  //     (
  //       toFixedNumber(formData.balance_due, 2) - total_amount_to_credit
  //     ).toLocaleString(undefined, {
  //       style: "currency",
  //       currency: "SGD",
  //     }),
  //   [formData.balance_due, total_amount_to_credit]
  // );

  // const total_amount_to_credit = 0;
  // const balance_due = 0;

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="summary table">
        <TableBody>
          <TableRow hover>
            <TableCell>Invoice Balance</TableCell>
            <TableCell align="right">
              {Number(formData.balance_due).toLocaleString(undefined, {
                style: "currency",
                currency: "SGD",
              })}
            </TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell>Amount to Credit</TableCell>
            <TableCell align="right">
              (-){" "}
              {total_amount_to_credit.toLocaleString(undefined, {
                style: "currency",
                currency: "SGD",
              })}
            </TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell>
              <Typography variant="h6" gutterBottom>
                Invoice Balance Due (SGD)
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="h6" gutterBottom>
                {balance_due.toLocaleString(undefined, {
                  style: "currency",
                  currency: "SGD",
                })}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
