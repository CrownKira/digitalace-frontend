import { FC } from 'react';
import {
  InputProps,
  FormDataConsumerRenderParams,
  useDataProvider,
  required,
} from 'react-admin';
import { useForm } from 'react-final-form';

import { AsyncAutocompleteInput } from '../utils/components/AsyncAutocompleteInput';

interface Props extends Omit<InputProps, 'source'> {
  // this is needed since the source might be different but still refers to agent
  source?: string;
}

const CustomerNameInput: FC<Props> = (props) => {
  const form = useForm();
  const dataProvider = useDataProvider();

  return (
    <AsyncAutocompleteInput
      optionText="name"
      optionValue="id"
      source="customer"
      resource="invoices"
      reference="customers"
      validate={requiredValidate}
      fullWidth
      onChange={async (event, newValue) => {
        if (newValue) {
          console.log('fetching...');

          const response = await dataProvider.getManyReference('credit_notes', {
            target: 'customer',
            id: newValue.id,
            pagination: { page: 1, perPage: 25 },
            sort: { field: 'id', order: 'DESC' },
            filter: {},
          });

          // const response = await dataProvider.getList('credits_applications', {
          //   // TODO: load more button
          //   pagination: { page: 1, perPage: 25 },
          //   sort: { field: 'id', order: 'DESC' },
          //   filter: { credit_note__customer: newValue.id },
          // });

          response && form.change('creditsapplication_set', response.data);
          console.log('end fetch...');
        }
      }}
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
