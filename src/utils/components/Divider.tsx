import React from "react";
import { useTranslate } from "react-admin";
import { Typography, Box } from "@material-ui/core";

export const SectionTitle = ({ label }: { label: string }) => {
  const translate = useTranslate();

  return (
    <Typography variant="h6" gutterBottom>
      {translate(label)}
    </Typography>
  );
};

export const Separator = () => <Box pt="1em" />;
export const Break = () => <Box />;
