import React, { FC } from "react";

import {
  AsyncAutocompleteInput,
  AsyncAutocompleteInputProps,
} from "../../utils/components/AsyncAutocompleteInput";

interface Props extends Omit<AsyncAutocompleteInputProps, "source"> {
  // this is needed since the source might be different but still refers to agent
  source?: string;
}

export const SupplierNameInput: FC<Props> = (props) => {
  return (
    <AsyncAutocompleteInput
      optionText="name"
      optionValue="id"
      source="supplier"
      reference="suppliers"
      // fullWidth
      {...props}
    />
  );
};

SupplierNameInput.defaultProps = {
  source: "supplier",
};
