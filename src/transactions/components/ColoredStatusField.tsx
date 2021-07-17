import React from "react";
import { SelectField, SelectFieldProps } from "react-admin";
import { useTheme } from "@material-ui/core/styles";

const getColor = (status: string) => {
  if (
    [
      "DFT", // draft
    ].includes(status)
  ) {
    return "disabled";
  }

  if (
    [
      "PD", // paid
      "OP", // open
      "CL", // closed
      "CP", // completed
    ].includes(status)
  ) {
    return "success";
  }

  if (
    [
      "PNDG", // pending
    ].includes(status)
  ) {
    return "warning";
  }

  if (
    [
      "UPD", // unpaid
      "CC", // cancelled
    ].includes(status)
  ) {
    return "error";
  }
};

export const ColoredStatusField = (props: SelectFieldProps) => {
  const theme = useTheme();

  if (props.record && props.source) {
    switch (getColor(props.record[props.source])) {
      case "disabled":
        return (
          <span style={{ color: theme.palette.action.disabled }}>
            <SelectField {...props} />
          </span>
        );
      case "success":
        return (
          <span style={{ color: theme.palette.success.main }}>
            <SelectField {...props} />
          </span>
        );

      case "warning":
        return (
          <span style={{ color: theme.palette.warning.main }}>
            <SelectField {...props} />
          </span>
        );

      case "error":
        return (
          <span style={{ color: theme.palette.error.main }}>
            <SelectField {...props} />
          </span>
        );
      default:
        return <SelectField {...props} />;
    }
  }

  return null;
};

ColoredStatusField.defaultProps = SelectField.defaultProps;
