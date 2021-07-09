import { FC } from 'react';
import { Box } from '@material-ui/core';
import { DateInput, TextInput, SelectInput, ReferenceInput } from 'react-admin';

interface Props {}

export const PaymentSection: FC<Props> = () => {
  return (
    <>
      <Box display={{ sm: 'block', md: 'flex' }}>
        <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
          <DateInput source="payment_date" resource="invoices" fullWidth />
        </Box>
        <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
          <ReferenceInput
            source="payment_method"
            reference="payment_methods"
            fullWidth
          >
            <SelectInput source="name" />
          </ReferenceInput>
        </Box>
      </Box>
      <TextInput source="payment_note" multiline fullWidth />
    </>
  );
};
