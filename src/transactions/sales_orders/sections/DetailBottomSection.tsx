import React, { FC } from "react";
import { NumberInput, FormDataConsumer } from "react-admin";
import { Box, InputAdornment } from "@material-ui/core";

import { TotalInput } from "../fields/TotalInput";
import { validateNumber } from "../SalesOrderCreate";

interface Props {
  formProps: any;
}

export const DetailBottomSection: FC<Props> = ({ formProps }) => {
  return (
    <Box display={{ sm: "block", md: "flex" }}>
      <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
        <FormDataConsumer>
          {(props) => (
            <TotalInput
              source="total_amount"
              resource="sales_orders"
              fullWidth
              disabled
              {...props}
            />
          )}
        </FormDataConsumer>
        <Box display={{ sm: "block", md: "flex" }}>
          <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
            <NumberInput
              source="discount_rate"
              resource="sales_orders"
              fullWidth
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
          </Box>
          <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
            <NumberInput
              source="discount_amount"
              resource="sales_orders"
              fullWidth
              disabled
            />
          </Box>
        </Box>
        <NumberInput source="net" resource="sales_orders" fullWidth disabled />
      </Box>
      <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
        <Box display={{ sm: "block", md: "flex" }}>
          <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
            <NumberInput
              source="gst_rate"
              resource="sales_orders"
              fullWidth
              validate={validateNumber}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </Box>
          <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
            <NumberInput
              source="gst_amount"
              resource="sales_orders"
              fullWidth
              disabled
            />
          </Box>
        </Box>
        <NumberInput
          source="grand_total"
          resource="sales_orders"
          fullWidth
          disabled
        />
      </Box>
    </Box>
  );
};
