import { FC } from 'react';
import { required } from 'react-admin';

import {
  AsyncAutocompleteInput,
  AsyncAutocompleteInputProps,
} from '../../../utils/components/AsyncAutocompleteInput';

interface Props extends Omit<AsyncAutocompleteInputProps, 'source'> {
  // this is needed since the source might be different but still refers to agent
  source?: string;
}

export const CustomerNameInput: FC<Props> = (props) => {
  return (
    <AsyncAutocompleteInput
      optionText="name"
      optionValue="id"
      source="customer"
      resource="invoices"
      reference="customers"
      validate={requiredValidate}
      fullWidth
      {...props}
    />
  );
};

CustomerNameInput.defaultProps = {
  source: 'customer',
};

const requiredValidate = required();
