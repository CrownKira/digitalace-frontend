import React from "react";
import { CircularProgress } from "@material-ui/core";
import { useTimeout } from "react-admin";

export const AutocompleteInputLoader = ({
  timeout = 1000,
  className = "MuiAutocomplete-endAdornment",
}) => {
  const oneSecondHasPassed = useTimeout(timeout);

  if (oneSecondHasPassed) {
    return <CircularProgress size={24} className={className} />;
  }

  return null;
};
