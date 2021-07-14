import React, { FC } from "react";
import { Box, Paper as MuiPaper } from "@material-ui/core";
import RichTextInput from "ra-input-rich-text";

import { TotalSection } from "./TotalSection";
import { Totals } from "../SalesOrderCreate";

interface Props {
  totals: Totals;
  updateTotals: (formData: any) => void;
}

// TODO: apply credits in show
export const DetailsBottomSection: FC<Props> = ({ totals, updateTotals }) => {
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
