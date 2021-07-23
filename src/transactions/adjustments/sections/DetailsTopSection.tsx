/* eslint-disable @typescript-eslint/ban-types */
import React, { FC } from "react";
import { Box } from "@material-ui/core";
import { DateInput, TextInput, SelectInput } from "react-admin";

import { statuses, modes } from "../data";
import { requiredValidate, validateReference } from "../AdjustmentCreate";

interface Props {
  props: any;
}

export const DetailsTopSection: FC<Props> = ({ props }) => {
  return (
    <Box display={{ sm: "block", md: "flex" }}>
      <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
        <DateInput
          source="date"
          resource="adjustments"
          fullWidth
          validate={requiredValidate}
        />
        <TextInput multiline source="reason" />
      </Box>
      <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
        <Box display={{ sm: "block", md: "flex" }}>
          <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
            <TextInput
              source="reference"
              resource="adjustments"
              fullWidth
              validate={validateReference(props)}
            />
          </Box>
          <Box flex={1} ml={{ sm: 0, md: "0.5em" }} />
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
          <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
            <SelectInput
              source="mode"
              choices={modes}
              fullWidth
              validate={requiredValidate}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
