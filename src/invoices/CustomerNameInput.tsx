import { FC } from 'react';
import { InputProps, required } from 'react-admin';
import { useForm } from 'react-final-form';

import { AsyncAutocompleteInput } from '../utils/components/AsyncAutocompleteInput';

interface Props extends Omit<InputProps, 'source'> {}

// TODO: create a generic input which uses useForm
const CustomerNameInput: FC<Props> = (props) => {
  const form = useForm();
  return (
    <AsyncAutocompleteInput
      getOptionLabel={(option) => option.name}
      source="customer"
      resource="invoices"
      reference="customers"
      validate={requiredValidate}
      fullWidth
      onChange={(event, newValue) => {
        form.change('customer_id', newValue ? newValue.id : '');
      }}
    />
  );
};

CustomerNameInput.defaultProps = {};

const requiredValidate = [required()];

export default CustomerNameInput;
