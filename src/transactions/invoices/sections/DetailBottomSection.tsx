import React, { FC } from "react";
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

import { CreditsAppliedInput } from "../fields/CreditsAppliedInput";
import { validateNumber } from "../InvoiceCreate";
import { PriceField } from "../../../utils/components/PriceField";
import { TotalSection } from "./TotalSection";

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
  totals: {
    total_amount: number;
    discount_amount: number;
    net: number;
    gst_amount: number;
    grand_total: number;
    balance_due: number;
    credits_applied: number;
  };
  updateTotals: (formData: any) => void;
}

// function ccyFormat(num: number) {
//   return `${num.toFixed(2)}`;
// }

// function priceRow(qty: number, unit: number) {
//   return qty * unit;
// }

// function createRow(desc: string, qty: number, unit: number) {
//   const price = priceRow(qty, unit);
//   return { desc, qty, unit, price };
// }

// interface Row {
//   desc: string;
//   qty: number;
//   unit: number;
//   price: number;
// }

// function subtotal(items: Row[]) {
//   return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
// }

// const rows = [
//   createRow("Paperclips (Box)", 100, 1.15),
//   createRow("Paper (Case)", 10, 45.99),
//   createRow("Waste Basket", 2, 17.99),
// ];

// const invoiceSubtotal = subtotal(rows);
// const invoiceTaxes = TAX_RATE * invoiceSubtotal;
// const invoiceTotal = invoiceTaxes + invoiceSubtotal;

// TODO: apply credits in show
export const DetailBottomSection: FC<Props> = ({ totals, updateTotals }) => {
  const classes = useStyles();

  return (
    <Box display={{ sm: "block", md: "flex" }}>
      <Box flex={2} mr={{ sm: 0, md: "0.5em" }}>
        <RichTextInput source="description" label="" />
      </Box>
      <Box flex={1} mr={{ sm: 0, md: "0.5em" }}></Box>
      <Box flex={2} mr={{ sm: 0, md: "0.5em" }}>
        <TotalSection totals={totals} updateTotals={updateTotals} />
      </Box>
    </Box>
  );
};
