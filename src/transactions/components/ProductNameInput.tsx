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
  formData,
  scopedFormData,
  getSource,
  inputClassName,
  ...rest
}) => {
  const form = useForm();

  return (
    <AsyncAutocompleteInput
      {...rest} // pass injected props
      optionText="name"
      optionValue="id"
      reference="products"
      onChange={(event, newValue) => {
        getSource &&
          newValue &&
          form.batch(() => {
            form.change(getSource("unit"), newValue.unit);
            form.change(getSource("unit_price"), newValue.unit_price);
            form.change(getSource("quantity"), "0");
          });
      }}
      className={inputClassName}
      showSuggestions={false}
    />
  );
};

ProductNameInput.defaultProps = {
  source: "product",
};
