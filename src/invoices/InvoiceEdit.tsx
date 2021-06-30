import { FC } from 'react';
import {
  Edit,
  EditProps,
  TextInput,
  Toolbar,
  FormWithRedirect,
  required,
  DateInput,
  NumberInput,
  ArrayInput,
  SimpleFormIterator,
  SelectInput,
  FormDataConsumer,
  ReferenceInput,
  SaveButton,
  DeleteButton,
} from 'react-admin';
import { Box, Card, CardContent, InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RichTextInput from 'ra-input-rich-text';

import { statuses } from './data';
import ProductNameInput from './ProductNameInput';
import AmountInput from './AmountInput';
import TotalInput from './TotalInput';
import LineNumberField from './LineNumberField';
import { useOnFailure, useValidateUnicity } from '../utils/hooks';
import { AsyncAutocompleteInput } from '../utils/components/AsyncAutocompleteInput';
import { transform, styles as createStyles } from './InvoiceCreate';

const useStyles = makeStyles({
  ...createStyles,
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

const InvoiceEdit: FC<EditProps> = (props) => {
  return (
    <Edit component="div" {...props}>
      <InvoiceForm />
    </Edit>
  );
};

const InvoiceForm = (props: any) => {
  // TODO: add custom onFailure
  const classes = useStyles();
  const onFailure = useOnFailure();

  // somehow this is not getting reinvoked every time
  // qn: is React caching results automatically?
  const validateReferenceUnicity = useValidateUnicity({
    reference: 'invoices',
    source: 'reference',
    record: props.record,
    message: 'resources.invoices.validation.reference_already_used',
  });

  /**
   * You can have tooling support which checks and enforces these rules.
   * For example, eslint-plugin-react-hooks utilizes a heuristic that assumes,
   * a function starting with "use" prefix and a capital letter after it is a Hook.
   */

  return (
    <FormWithRedirect
      {...props}
      render={(formProps: any) => (
        <Card>
          <form>
            <CardContent>
              <Box display={{ sm: 'block', md: 'flex' }}>
                <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                  <Box display={{ sm: 'block', md: 'flex' }}>
                    <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                      <TextInput
                        source="reference"
                        resource="invoices"
                        fullWidth
                        validate={[requiredValidate, validateReferenceUnicity]}
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                      <AsyncAutocompleteInput
                        // TODO: edit button start adornment
                        // refer to ProductNameInput.tsx
                        optionText="reference"
                        optionValue="id"
                        source="sales_order"
                        resource="invoices"
                        reference="sales_orders"
                        fullWidth
                      />
                    </Box>
                  </Box>
                  <Box display={{ sm: 'block', md: 'flex' }}>
                    <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                      <AsyncAutocompleteInput
                        optionText="name"
                        optionValue="id"
                        source="customer"
                        resource="invoices"
                        reference="customers"
                        validate={requiredValidate}
                        fullWidth
                        // helperText="Please select your customer"
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}></Box>
                  </Box>
                  <RichTextInput source="description" label="" />
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
                      <AsyncAutocompleteInput
                        optionText="name"
                        optionValue="id"
                        source="salesperson"
                        resource="invoices"
                        reference="employees"
                        fullWidth
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                      <SelectInput
                        source="status"
                        choices={statuses}
                        fullWidth
                        validate={requiredValidate}
                      />
                    </Box>
                  </Box>
                  <FormDataConsumer>
                    {({ formData }) => (
                      <Box
                        display={{ sm: 'block', md: 'flex' }}
                        // hide instead of null so that date is formatted properly
                        className={
                          formData && formData.status === 'UPD'
                            ? classes.hiddenInput
                            : ''
                        }
                      >
                        <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                          <DateInput
                            source="payment_date"
                            resource="invoices"
                            fullWidth
                          />
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
                    )}
                  </FormDataConsumer>
                  <FormDataConsumer>
                    {({ formData }) => (
                      <TextInput
                        source="payment_note"
                        multiline
                        fullWidth
                        className={
                          formData && formData.status === 'UPD'
                            ? classes.hiddenInput
                            : ''
                        }
                      />
                    )}
                  </FormDataConsumer>
                </Box>
              </Box>
              <Card>
                <CardContent>
                  <ArrayInput
                    source="invoiceitem_set"
                    resource="invoice_items"
                    label="resources.invoices.fields.invoiceitem_set"
                    validate={requiredValidate}
                  >
                    <SimpleFormIterator resource="invoice_items">
                      <FormDataConsumer
                        formClassName={classes.leftFormGroup}
                        validate={requiredValidate}
                      >
                        {({ getSource, ...rest }) =>
                          getSource ? (
                            <ProductNameInput
                              source={getSource('product')}
                              getSource={getSource}
                              fullWidth
                              inputClassName={classes.productInput}
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
                              // hint: this happened because props are injected into react element
                              // instead of NumberInput
                              // save={formProps.save.toString()}
                              // saving={formProps.saving.toString()}
                              {...rest}
                            />
                          ) : null
                        }
                      </FormDataConsumer>
                    </SimpleFormIterator>
                  </ArrayInput>
                </CardContent>
              </Card>
              <Box display={{ sm: 'block', md: 'flex' }}>
                <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                  <FormDataConsumer>
                    {(props) => (
                      <TotalInput
                        source="total_amount"
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
                        fullWidth
                        validate={requiredValidate}
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
                        fullWidth
                        validate={requiredValidate}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                      <NumberInput
                        source="gst_amount"
                        resource="invoices"
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
                  <FormDataConsumer>
                    {(props) => (
                      <LineNumberField
                        source="total_lines"
                        resource="invoices"
                        fullWidth
                        label="resources.invoices.fields.total_lines"
                        {...props}
                      />
                    )}
                  </FormDataConsumer>
                </Box>
              </Box>
            </CardContent>
            <Toolbar
              // props from react-admin demo VisitorEdit
              resource="invoices"
              record={formProps.record}
              basePath={formProps.basePath}
              undoable={true}
              invalid={formProps.invalid}
              handleSubmit={formProps.handleSubmit}
              saving={formProps.saving}
              pristine={formProps.pristine}
              classes={{ toolbar: classes.toolbar }}
            >
              <SaveButton
                // props from Toolbar.tsx
                handleSubmitWithRedirect={
                  formProps.handleSubmitWithRedirect || formProps.handleSubmit
                }
                disabled={formProps.disabled}
                invalid={formProps.invalid}
                redirect={formProps.redirect}
                saving={formProps.saving}
                submitOnEnter={formProps.submitOnEnter}
                transform={transform}
                onFailure={onFailure}
              />
              {formProps.record && formProps.record.id !== undefined && (
                <DeleteButton
                  // props from Toolbar.tsx
                  basePath={formProps.basePath}
                  record={formProps.record}
                  resource={formProps.resource}
                  mutationMode={formProps.mutationMode}
                />
              )}
            </Toolbar>
          </form>
        </Card>
      )}
    />
  );
};

const requiredValidate = required();

export default InvoiceEdit;

// <FormDataConsumer>
// {({ formData }) => (
//   <Labeled label="resources.invoices.fields.customer_id">
//     <ReferenceField
//       source="customer"
//       reference="customers"
//       record={formData}
//     >
//       <TextField source="reference" />
//     </ReferenceField>
//   </Labeled>
// )}
// </FormDataConsumer>
