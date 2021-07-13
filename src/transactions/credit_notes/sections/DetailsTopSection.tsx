/* eslint-disable @typescript-eslint/ban-types */
import React, { FC } from "react";
import { Box } from "@material-ui/core";
import { DateInput, TextInput, SelectInput } from "react-admin";

import { statuses } from "../data";
import { AsyncAutocompleteInput } from "../../../utils/components/AsyncAutocompleteInput";
import { requiredValidate, validateReference } from "../CreditNoteCreate";
import { CustomerNameInput } from "../../components/CustomerNameInput";

interface Props {
  props: any;
}

export const DetailsTopSection: FC<Props> = ({ props }) => {
  return (
    <Box display={{ sm: "block", md: "flex" }}>
      <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
        <DateInput
          source="date"
          resource="credit_notes"
          fullWidth
          validate={requiredValidate}
        />
        <Box display={{ sm: "block", md: "flex" }}>
          <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
            <CustomerNameInput
              validate={requiredValidate}
              resource="credit_notes"
            />
          </Box>
          <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
            <AsyncAutocompleteInput
              // TODO: wrap all AsyncAutocompleteInput, to be shared by other documents
              optionText="name"
              optionValue="id"
              source="salesperson"
              resource="credit_notes"
              reference="employees"
              fullWidth
            />
          </Box>
        </Box>
      </Box>
      <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
        <Box display={{ sm: "block", md: "flex" }}>
          <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
            <TextInput
              source="reference"
              resource="credit_notes"
              fullWidth
              validate={validateReference(props)}
            />
          </Box>
          <Box flex={1} ml={{ sm: 0, md: "0.5em" }}></Box>
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
