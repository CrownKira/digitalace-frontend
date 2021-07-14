import React from "react";
import { useTranslate } from "react-admin";
import { Typography, Box } from "@material-ui/core";

export const SectionTitle = ({
  label,
  options,
}: {
  label: string;
  options?: any;
}): JSX.Element => {
  const translate = useTranslate();

  return (
    <Typography variant="h6" gutterBottom>
      {translate(label, options)}
    </Typography>
  );
};

export const Separator = (): JSX.Element => <Box pt="1em" />;
export const Break = (): JSX.Element => <Box />;
