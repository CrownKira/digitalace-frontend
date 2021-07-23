import React, { FC } from "react";
import { useTranslate } from "react-admin";
import { Box } from "@material-ui/core";
import RichTextInput from "ra-input-rich-text";

import { TotalSection } from "./TotalSection";
import { Totals } from "../SalesOrderCreate";

interface Props {
  totals: Totals;
  updateTotals: (formData: any) => void;
}

// TODO: apply credits in show
export const DetailsBottomSection: FC<Props> = ({ totals, updateTotals }) => {
  const translate = useTranslate();
  const label = translate("resources.credit_notes.fields.description");

  return (
    <Box display={{ sm: "block", md: "flex" }}>
      <Box flex={2} mr={{ sm: 0, md: "0.5em" }}>
        <RichTextInput
          source="description"
          resource="sales_orders"
          label={label}
        />
      </Box>
      <Box flex={1} mr={{ sm: 0, md: "0.5em" }}></Box>
      <Box flex={2} mr={{ sm: 0, md: "0.5em" }}>
        <TotalSection totals={totals} updateTotals={updateTotals} />
      </Box>
    </Box>
  );
};
