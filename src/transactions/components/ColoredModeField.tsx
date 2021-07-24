import React from "react";
import { SelectField, SelectFieldProps } from "react-admin";
import { useTheme } from "@material-ui/core/styles";

const getColor = (mode: string) => {
  if (["INC"].includes(mode)) {
    return "success";
  }

  if (["DEC"].includes(mode)) {
    return "warning";
  }
};

export const ColoredModeField = (props: SelectFieldProps) => {
  const theme = useTheme();

  if (props.record && props.source) {
    switch (getColor(props.record[props.source])) {
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
      default:
        return <SelectField {...props} />;
    }
  }

  return null;
};

ColoredModeField.defaultProps = SelectField.defaultProps;
