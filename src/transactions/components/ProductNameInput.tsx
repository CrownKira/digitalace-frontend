import { FormatColorResetRounded } from "@material-ui/icons";
import React, { FC } from "react";
import { InputProps, FormDataConsumerRenderParams } from "react-admin";
import { useForm } from "react-final-form";

import { AsyncAutocompleteInput } from "../../utils/components/AsyncAutocompleteInput";

interface Props
  extends Omit<InputProps, "source">,
    Omit<FormDataConsumerRenderParams, "formData"> {
  inputClassName?: string | undefined;
  source?: string;
  formData?: any;
}

export const ProductNameInput: FC<Props> = ({
  // TODO: useFormState instead?
  // formData,
  // scopedFormData,
  getSource,
  inputClassName,
  ...rest
}) => {
  const form = useForm();

  return getSource ? (
    <AsyncAutocompleteInput
      {...rest} // pass injected props
      optionText="name"
      optionValue="id"
      reference="products"
      onChange={(event, newValue) => {
        if (newValue) {
          form.batch(() => {
            form.change(getSource("unit"), newValue.unit);
            form.change(getSource("unit_price"), newValue.unit_price);
            form.change(getSource("quantity"), "0");
          });
        }
      }}
      className={inputClassName}
      // TODO: more generic label?
      label={false}
    />
  ) : null;
};

ProductNameInput.defaultProps = {
  source: "product",
};
