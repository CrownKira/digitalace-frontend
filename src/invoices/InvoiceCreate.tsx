import { FC, useState } from 'react';
import {
  Create,
  CreateProps,
  TextInput,
  Toolbar,
  FormWithRedirect,
  required,
  DateInput,
  NumberInput,
  ArrayInput,
  SimpleFormIterator,
  TextField,
  Labeled,
  ReferenceField,
  ReferenceInput,

  // AutocompleteInput,
  SelectInput,
  Identifier,
  Record,
  FormDataConsumer,
} from 'react-admin';
// import { useForm } from 'react-final-form';
import { Box, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RichTextInput from 'ra-input-rich-text';

import { statuses } from './data';
import CustomerNameInput from './CustomerNameInput';
import ProductNameInput from './ProductNameInput';
import AmountInput from './AmountInput';
import TotalInput from './TotalInput';
import { AsyncAutocompleteInput } from '../utils/components/AsyncAutocompleteInput';

export const styles = {
  leftFormGroup: { display: 'inline-block', marginRight: '0.5em' },
  rightFormGroup: {
    display: 'inline-block',
  },
  lineItemInput: { width: 150 },
};

const useStyles = makeStyles(styles);

const InvoiceCreate: FC<CreateProps> = (props) => {
  return (
    <Create component="div" {...props}>
      <InvoiceForm />
    </Create>
  );
};

const InvoiceForm = (props: any) => {
  const classes = useStyles();

  return (
    <FormWithRedirect
      {...props}
      // validate={validatePasswords}
      render={(formProps: any) => (
        <Card>
          <form>
            <CardContent>
              <Box display={{ sm: 'block', md: 'flex' }}>
                <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                  <Box display={{ sm: 'block', md: 'flex' }}>
                    <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                      <CustomerNameInput />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                      <TextInput
                        source="customer_id"
                        resource="invoices"
                        fullWidth
                        disabled
                      />
                    </Box>
                  </Box>

                  <Box display={{ sm: 'block', md: 'flex' }}>
                    <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                      <TextInput
                        source="attention"
                        resource="invoices"
                        validate={requiredValidate}
                        fullWidth
                      />
                    </Box>

                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                      <AsyncAutocompleteInput
                        getOptionLabel={(option) => option.name}
                        source="salesperson"
                        resource="invoices"
                        reference="employees"
                        validate={requiredValidate}
                        fullWidth
                      />
                    </Box>
                  </Box>

                  <RichTextInput source="description" label="" rows={2} />
                </Box>
                <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                  <DateInput
                    source="date"
                    resource="invoices"
                    fullWidth
                    validate={requiredValidate}
                  />

                  <Box display={{ sm: 'block', md: 'flex' }}>
                    <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                      <TextInput
                        source="id"
                        resource="invoices"
                        fullWidth
                        validate={requiredValidate}
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                      <AsyncAutocompleteInput
                        getOptionLabel={(option) => option.name}
                        source="sales_order"
                        resource="invoices"
                        reference="sales_orders"
                        validate={requiredValidate}
                        fullWidth
                      />
                    </Box>
                  </Box>

                  <Box display={{ sm: 'block', md: 'flex' }}>
                    <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                      <SelectInput
                        source="status"
                        choices={statuses}
                        fullWidth
                        formClassName={classes.rightFormGroup}
                        validate={requiredValidate}
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                      <DateInput
                        source="payment_date"
                        resource="invoices"
                        fullWidth
                        validate={requiredValidate}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box display={{ sm: 'block', md: 'flex' }}>
                <ArrayInput
                  source="invoiceitem_set"
                  resource="invoice_items"
                  label="resources.invoices.fields.invoiceitem_set"
                >
                  <SimpleFormIterator resource="invoice_items">
                    <FormDataConsumer formClassName={classes.leftFormGroup}>
                      {({ getSource, ...rest }) =>
                        getSource ? (
                          <ProductNameInput
                            source={getSource('product')}
                            getSource={getSource}
                            fullWidth
                            inputClassName={classes.lineItemInput}
                            validate={requiredValidate}
                            {...rest}
                          />
                        ) : null
                      }
                    </FormDataConsumer>

                    <NumberInput
                      source="quantity"
                      formClassName={classes.leftFormGroup}
                      className={classes.lineItemInput}
                      validate={requiredValidate}
                    />

                    <TextInput
                      source="unit"
                      formClassName={classes.leftFormGroup}
                      className={classes.lineItemInput}
                      validate={requiredValidate}
                      disabled
                    />

                    <NumberInput
                      source="unit_price"
                      formClassName={classes.leftFormGroup}
                      className={classes.lineItemInput}
                      validate={requiredValidate}
                    />

                    <FormDataConsumer
                      formClassName={classes.leftFormGroup}
                      disabled
                    >
                      {({ getSource, ...rest }) =>
                        getSource ? (
                          <AmountInput
                            source={getSource('amount')}
                            getSource={getSource}
                            inputClassName={classes.lineItemInput}
                            validate={requiredValidate}
                            // FIXME: error thrown if do no pass save and saving as strings
                            save={formProps.save.toString()}
                            saving={formProps.saving.toString()}
                            {...rest}
                          />
                        ) : null
                      }
                    </FormDataConsumer>
                  </SimpleFormIterator>
                </ArrayInput>
              </Box>
              <Box display={{ sm: 'block', md: 'flex' }}>
                <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                  <FormDataConsumer>
                    {(props) => (
                      <TotalInput
                        source="total"
                        resource="invoices"
                        fullWidth
                        validate={requiredValidate}
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
                        // formClassName={classes.leftFormGroup}
                        fullWidth
                        validate={requiredValidate}
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                      <NumberInput
                        source="discount_amount"
                        resource="invoices"
                        // formClassName={classes.rightFormGroup}
                        fullWidth
                        validate={requiredValidate}
                        disabled
                      />
                    </Box>
                  </Box>
                  <NumberInput
                    source="net"
                    resource="invoices"
                    fullWidth
                    validate={requiredValidate}
                    disabled
                  />
                </Box>
                <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                  <Box display={{ sm: 'block', md: 'flex' }}>
                    <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                      <NumberInput
                        source="gst_rate"
                        resource="invoices"
                        // formClassName={classes.leftFormGroup}
                        fullWidth
                        validate={requiredValidate}
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                      <NumberInput
                        source="gst_amount"
                        resource="invoices"
                        // formClassName={classes.rightFormGroup}
                        fullWidth
                        validate={requiredValidate}
                        disabled
                      />
                    </Box>
                  </Box>
                  <NumberInput
                    source="grand_total"
                    resource="invoices"
                    fullWidth
                    validate={requiredValidate}
                    disabled
                  />
                  <Labeled label="resources.invoices.fields.total_lines">
                    <TextField
                      source="total_lines"
                      resource="invoices"
                      fullWidth
                    />
                  </Labeled>
                </Box>
              </Box>
            </CardContent>
            <Toolbar
              resource="invoices"
              record={formProps.record}
              basePath={formProps.basePath}
              undoable={true}
              invalid={formProps.invalid}
              handleSubmit={formProps.handleSubmit}
              saving={formProps.saving}
              pristine={formProps.pristine}
            />
          </form>
        </Card>
      )}
    />
  );
};

const requiredValidate = [required()];

export default InvoiceCreate;
