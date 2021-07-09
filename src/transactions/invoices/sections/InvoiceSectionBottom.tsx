import { FC } from 'react';
import {
  NumberInput,
  FormDataConsumer,
  ReferenceField,
  Labeled,
} from 'react-admin';
import { Box, InputAdornment } from '@material-ui/core';

import { TotalInput } from '../fields/TotalInput';
import { CreditsAppliedInput } from '../fields/CreditsAppliedInput';
import { validateNumber } from '../InvoiceCreate';
import { PriceField } from '../../../utils/components/PriceField';

interface Props {
  formProps: any;
}

export const InvoiceSectionBottom: FC<Props> = ({ formProps }) => {
  return (
    <Box display={{ sm: 'block', md: 'flex' }}>
      <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
        <FormDataConsumer>
          {(props) => (
            <TotalInput
              source="total_amount"
              resource="invoices"
              fullWidth
              disabled
              {...props}
            />
          )}
        </FormDataConsumer>
        <Box display={{ sm: 'block', md: 'flex' }}>
          <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
            <NumberInput
              source="discount_rate"
              resource="invoices"
              fullWidth
              validate={validateNumber}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    // qn: is this redundant?
                    position="end"
                  >
                    %
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
            <NumberInput
              source="discount_amount"
              resource="invoices"
              fullWidth
              disabled
            />
          </Box>
        </Box>
        <NumberInput source="net" resource="invoices" fullWidth disabled />
      </Box>
      <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
        <Box display={{ sm: 'block', md: 'flex' }}>
          <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
            <NumberInput
              source="gst_rate"
              resource="invoices"
              fullWidth
              validate={validateNumber}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </Box>
          <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
            <NumberInput
              source="gst_amount"
              resource="invoices"
              fullWidth
              disabled
            />
          </Box>
        </Box>
        <NumberInput
          source="grand_total"
          resource="invoices"
          fullWidth
          disabled
        />
        <Box display={{ sm: 'block', md: 'flex' }}>
          <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
            <FormDataConsumer>
              {({ formData }) => (
                <Labeled label="resources.invoices.fields.credits_available">
                  <ReferenceField
                    source="customer"
                    reference="customers"
                    record={formData}
                  >
                    <PriceField source="unused_credits" />
                  </ReferenceField>
                </Labeled>
              )}
            </FormDataConsumer>
          </Box>
          <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
            <FormDataConsumer>
              {(props) => (
                <CreditsAppliedInput
                  source="credits_applied"
                  resource="invoices"
                  fullWidth
                  disabled
                  record={formProps.record}
                  {...props}
                />
              )}
            </FormDataConsumer>
          </Box>
        </Box>
        <NumberInput
          source="balance_due"
          resource="invoices"
          fullWidth
          disabled
        />
      </Box>
    </Box>
  );
};
