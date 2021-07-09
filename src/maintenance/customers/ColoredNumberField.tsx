import { NumberField, NumberFieldProps } from "react-admin";

import { PriceField } from "../../utils/components/PriceField";

export const ColoredNumberField = (props: NumberFieldProps) =>
  props.record && props.source ? (
    props.record[props.source] > 500 ? (
      <span style={{ color: "red" }}>
        <PriceField {...props} />
      </span>
    ) : (
      <PriceField {...props} />
    )
  ) : null;

ColoredNumberField.defaultProps = NumberField.defaultProps;
