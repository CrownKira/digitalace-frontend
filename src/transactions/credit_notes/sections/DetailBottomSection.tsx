import React, { FC } from "react";
import { NumberInput, FormDataConsumer } from "react-admin";
import { Box, InputAdornment } from "@material-ui/core";

import { TotalInput } from "../fields/TotalInput";
import { validateNumber } from "../CreditNoteCreate";

interface Props {
  formProps: any;
}

export const DetailsBottomSection: FC<Props> = ({ formProps }) => {
  return (
    <Box display={{ sm: "block", md: "flex" }}>
      <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
        <FormDataConsumer>
          {(props) => (
            <TotalInput
              source="total_amount"
              resource="credit_notes"
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
              resource="credit_notes"
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
              resource="credit_notes"
              fullWidth
              disabled
            />
          </Box>
        </Box>
        <NumberInput source="net" resource="credit_notes" fullWidth disabled />
      </Box>
      <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
        <Box display={{ sm: "block", md: "flex" }}>
          <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
            <NumberInput
              source="gst_rate"
              resource="credit_notes"
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
              resource="credit_notes"
              fullWidth
              disabled
            />
          </Box>
        </Box>
        <NumberInput
          source="grand_total"
          resource="credit_notes"
          fullWidth
          disabled
        />
      </Box>
    </Box>
  );
};
