import React, { FC } from "react";
import {
  TableContainer,
  Table,
  Paper as MuiPaper,
  TableRow,
  TableCell as MuiTableCell,
  TableBody,
  Typography,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/styles";

import { Totals } from "../InvoiceCreate";
import { ccyFormat } from "../../../utils";

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
});

interface Props {
  creditsTotals: TotalCredits;
  totals: Totals;
}

export interface TotalCredits {
  total_amount_to_credit: number;
  balance_due: number;
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
  creditsTotals: { total_amount_to_credit, balance_due: balance_due2 },
  totals: { balance_due },
}) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="summary table">
        <TableBody>
          <TableRow hover>
            <TableCell>Invoice Balance</TableCell>
            <TableCell align="right">{ccyFormat(balance_due)}</TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell>Amount to Credit</TableCell>
            <TableCell align="right">
              (-) {ccyFormat(total_amount_to_credit)}
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
                {ccyFormat(balance_due2)}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
