import { FC } from 'react';
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
  SelectInput,
} from 'react-admin';
import { Box, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RichTextInput from 'ra-input-rich-text';

import { statuses } from './data';
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
                      <AsyncAutocompleteInput
                        getOptionLabel={(option) => option.name}
                        source="customer"
                        resource="customers"
                        reference="customers"
                        validate={requiredValidate}
                        fullWidth
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                      <Labeled label="resources.invoices.fields.customer_id">
                        <ReferenceField
                          source="customer"
                          reference="employees"
                          // validate={requiredValidate}

                          fullWidth
                        >
                          <TextField source="id" />
                        </ReferenceField>
                      </Labeled>
                    </Box>
                  </Box>

                  <Box display={{ sm: 'block', md: 'flex' }}>
                    <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                      <TextInput
                        source="attention"
                        resource="invoices"
                        validate={requiredValidate}
                        // helperText={false}
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
                    // helperText={false}
                    fullWidth
                    validate={requiredValidate}
                  />

                  <Box display={{ sm: 'block', md: 'flex' }}>
                    <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                      <TextInput
                        source="id"
                        resource="invoices"
                        // helperText={false}
                        fullWidth
                        validate={requiredValidate}
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                      <AsyncAutocompleteInput
                        getOptionLabel={(option) => option.name}
                        source="sales_order"
                        resource="sales_orders"
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
                        // helperText={false}
                        fullWidth
                        formClassName={classes.rightFormGroup}
                        validate={requiredValidate}
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                      <DateInput
                        source="payment_date"
                        resource="invoices"
                        // helperText={false}
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
                    <AsyncAutocompleteInput
                      getOptionLabel={(option) => option.name}
                      source="product"
                      resource="products"
                      reference="products"
                      formClassName={classes.leftFormGroup}
                      className={classes.lineItemInput}
                      validate={requiredValidate}
                    />

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
                    <NumberInput
                      source="amount"
                      formClassName={classes.rightFormGroup}
                      className={classes.lineItemInput}
                      validate={requiredValidate}
                      disabled
                    />
                  </SimpleFormIterator>
                </ArrayInput>
              </Box>
              <Box display={{ sm: 'block', md: 'flex' }}>
                <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                  <NumberInput
                    source="total"
                    resource="invoices"
                    // helperText={false}
                    fullWidth
                    validate={requiredValidate}
                    disabled
                  />
                  <Box display={{ sm: 'block', md: 'flex' }}>
                    <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                      <NumberInput
                        source="discount_rate"
                        resource="invoices"
                        // formClassName={classes.leftFormGroup}
                        // helperText={false}
                        fullWidth
                        validate={requiredValidate}
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                      <NumberInput
                        source="discount_amount"
                        resource="invoices"
                        // formClassName={classes.rightFormGroup}
                        // helperText={false}
                        fullWidth
                        validate={requiredValidate}
                        disabled
                      />
                    </Box>
                  </Box>
                  <NumberInput
                    source="net"
                    resource="invoices"
                    // helperText={false}
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
                        // helperText={false}
                        fullWidth
                        validate={requiredValidate}
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                      <NumberInput
                        source="gst_amount"
                        resource="invoices"
                        // formClassName={classes.rightFormGroup}
                        // helperText={false}
                        fullWidth
                        validate={requiredValidate}
                        disabled
                      />
                    </Box>
                  </Box>
                  <NumberInput
                    source="grand_total"
                    resource="invoices"
                    // helperText={false}
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
