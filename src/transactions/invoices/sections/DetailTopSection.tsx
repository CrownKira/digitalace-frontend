import React, { FC } from "react";
import { Box } from "@material-ui/core";
import { DateInput, TextInput, SelectInput, Record } from "react-admin";

import { statuses } from "../data";
import { AsyncAutocompleteInput } from "../../../utils/components/AsyncAutocompleteInput";
import { requiredValidate, validateReference } from "../InvoiceCreate";
import { CustomerNameInput } from "../../components/CustomerNameInput";

interface Props {
  props: any;
  isPaid: boolean;
  openApplyCredits: boolean;
  setIsPaid: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenApplyCredits: React.Dispatch<React.SetStateAction<boolean>>;
  setCreditsAvailable: React.Dispatch<React.SetStateAction<number>>;
}

export const DetailTopSection: FC<Props> = ({
  props,
  setIsPaid,
  setOpenApplyCredits,
  setCreditsAvailable,
}) => {
  return (
    <Box display={{ sm: "block", md: "flex" }}>
      <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
        <DateInput
          source="date"
          resource="invoices"
          fullWidth
          validate={requiredValidate}
        />
        <Box display={{ sm: "block", md: "flex" }}>
          <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
            <CustomerNameInput
              onChange={(event: any, newValue: Record) => {
                setOpenApplyCredits(false);
                setCreditsAvailable(Number(newValue?.unused_credits || 0));
              }}
              onInit={(value: Record) => {
                setCreditsAvailable(Number(value?.unused_credits || 0));
              }}
              validate={requiredValidate}
              resource="invoices"
              fullWidth
            />
          </Box>
          <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
            <AsyncAutocompleteInput
              // TODO: wrap all AsyncAutocompleteInput, to be shared by other documents
              optionText="name"
              optionValue="id"
              source="salesperson"
              resource="invoices"
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
              resource="invoices"
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
              source="sales_order"
              resource="invoices"
              reference="sales_orders"
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
              onChange={(event: any) => {
                setIsPaid(event.target.value === "PD");
              }}
            />
          </Box>
          <Box flex={1} ml={{ sm: 0, md: "0.5em" }}></Box>
        </Box>
      </Box>
    </Box>
  );
};
