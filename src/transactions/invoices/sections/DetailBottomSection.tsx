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

import { TotalInput } from "../fields/TotalInput";
import { CreditsAppliedInput } from "../fields/CreditsAppliedInput";
import { validateNumber } from "../InvoiceCreate";
import { PriceField } from "../../../utils/components/PriceField";

const TAX_RATE = 0.07;

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
  formProps: any;
}

function ccyFormat(num: number) {
  return `${num.toFixed(2)}`;
}

function priceRow(qty: number, unit: number) {
  return qty * unit;
}

function createRow(desc: string, qty: number, unit: number) {
  const price = priceRow(qty, unit);
  return { desc, qty, unit, price };
}

interface Row {
  desc: string;
  qty: number;
  unit: number;
  price: number;
}

function subtotal(items: Row[]) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const rows = [
  createRow("Paperclips (Box)", 100, 1.15),
  createRow("Paper (Case)", 10, 45.99),
  createRow("Waste Basket", 2, 17.99),
];

const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = TAX_RATE * invoiceSubtotal;
const invoiceTotal = invoiceTaxes + invoiceSubtotal;

// TODO: apply credits in show
export const DetailBottomSection: FC<Props> = ({ formProps }) => {
  const classes = useStyles();

  return (
    <Box display={{ sm: "block", md: "flex" }}>
      <Box flex={2} mr={{ sm: 0, md: "0.5em" }}>
        <RichTextInput source="description" label="" />
      </Box>
      <Box flex={1} mr={{ sm: 0, md: "0.5em" }}></Box>
      <Box flex={2} mr={{ sm: 0, md: "0.5em" }}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="summary table">
            <TableBody>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell align="right">0.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Discount</TableCell>
                <TableCell align="right">
                  <NumberInput
                    source="discount_rate"
                    resource="invoices"
                    // fullWidth
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
                <TableCell align="right">0.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Net</TableCell>
                <TableCell align="right">0.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>GST</TableCell>
                <TableCell align="right">
                  {" "}
                  <NumberInput
                    source="gst_rate"
                    resource="invoices"
                    // fullWidth
                    validate={validateNumber}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                  />
                </TableCell>
                <TableCell align="right">0.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography variant="h6" gutterBottom>
                    Grand Total (SGD)
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6" gutterBottom>
                    0.00
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Credits</TableCell>
                <TableCell align="right">0.00%</TableCell>
                <TableCell align="right">0.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography variant="h6" gutterBottom>
                    Balance Due (SGD)
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6" gutterBottom>
                    0.00
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
