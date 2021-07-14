import React from "react";
import { NumberField, NumberFieldProps } from "react-admin";

export const ColoredNumberField = (props: NumberFieldProps) =>
  props.record && props.source ? (
    props.record[props.source] > 500 ? (
      <span style={{ color: "red" }}>
        <NumberField {...props} />
      </span>
    ) : (
      <NumberField {...props} />
    )
  ) : null;

ColoredNumberField.defaultProps = NumberField.defaultProps;
