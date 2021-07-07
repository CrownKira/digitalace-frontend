import { FC } from 'react';
import {
  InputProps,
  FormDataConsumerRenderParams,
  useDataProvider,
  required,
} from 'react-admin';
import { useForm } from 'react-final-form';

import {
  AsyncAutocompleteInput,
  AsyncAutocompleteInputProps,
} from '../utils/components/AsyncAutocompleteInput';

interface Props extends Omit<AsyncAutocompleteInputProps, 'source'> {
  // this is needed since the source might be different but still refers to agent
  source?: string;
}

const CustomerNameInput: FC<Props> = (props) => {
  // const form = useForm();
  // const dataProvider = useDataProvider();

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

      // helperText="Please select your customer"
    />
  );
};

CustomerNameInput.defaultProps = {
  source: 'customer',
};

const requiredValidate = required();

export default CustomerNameInput;
