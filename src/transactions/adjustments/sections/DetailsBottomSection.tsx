import React, { FC } from "react";
import { useTranslate } from "react-admin";
import { Box } from "@material-ui/core";
import RichTextInput from "ra-input-rich-text";

interface Props {}

// TODO: apply credits in show
export const DetailsBottomSection: FC<Props> = () => {
  const translate = useTranslate();
  const label = translate("resources.adjustments.fields.description");

  return (
    <Box display={{ sm: "block", md: "flex" }}>
      <Box flex={2} mr={{ sm: 0, md: "0.5em" }}>
        <RichTextInput
          source="description"
          resource="adjustments"
          label={label}
        />
      </Box>
      <Box flex={1} mr={{ sm: 0, md: "0.5em" }}></Box>
      <Box flex={2} mr={{ sm: 0, md: "0.5em" }}></Box>
    </Box>
  );
};
