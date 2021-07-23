/* eslint-disable @typescript-eslint/ban-types */
import React, { FC } from "react";
import { Box } from "@material-ui/core";
import { DateInput, TextInput, SelectInput } from "react-admin";

import { statuses } from "../data";
import { requiredValidate, validateReference } from "../PurchaseOrderCreate";
import { SupplierNameInput } from "../../components/SupplierNameInput";
import { AsyncAutocompleteInput } from "../../../utils/components/AsyncAutocompleteInput";

interface Props {
  props: any;
}

export const DetailsTopSection: FC<Props> = ({ props }) => {
  return (
    <Box display={{ sm: "block", md: "flex" }}>
      <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
        <DateInput
          source="date"
          resource="purchase_orders"
          fullWidth
          validate={requiredValidate}
        />
        <Box display={{ sm: "block", md: "flex" }}>
          <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
            <SupplierNameInput
              validate={requiredValidate}
              resource="purchase_orders"
            />
          </Box>
          <Box flex={1} ml={{ sm: 0, md: "0.5em" }} />
        </Box>
      </Box>
      <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
        <Box display={{ sm: "block", md: "flex" }}>
          <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
            <TextInput
              source="reference"
              resource="purchase_orders"
              fullWidth
              validate={validateReference(props)}
            />
          </Box>
          <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
            <AsyncAutocompleteInput
              // TODO: edit button start adornment
              // refer to ProductNameInput.tsx
              optionText="reference"
              optionValue="id"
              source="receive"
              resource="purchase_orders"
              reference="receives"
              fullWidth
            />
          </Box>
        </Box>
        <Box display={{ sm: "block", md: "flex" }}>
          <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
            <SelectInput
              source="status"
              choices={statuses}
              fullWidth
              validate={requiredValidate}
            />
          </Box>
          <Box flex={1} ml={{ sm: 0, md: "0.5em" }}></Box>
        </Box>
      </Box>
    </Box>
  );
};
