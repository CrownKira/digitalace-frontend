import { FC, useState } from 'react';
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
  SelectInput,
  FormDataConsumer,
  ReferenceInput,
  SaveButton,
  TabbedForm,
  TabbedFormView,
  SimpleFormIterator,
  ReferenceField,
  DateField,
  TextField,
  NumberField,
  DeleteButton,
  Datagrid,
  Pagination,
  Labeled,
} from 'react-admin';
import { Box, Card, CardContent, InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RichTextInput from 'ra-input-rich-text';

import { statuses } from './data';
import ProductNameInput from './ProductNameInput';
import AmountInput from './AmountInput';
import TotalInput from './TotalInput';
import CreditsAppliedInput from './CreditsAppliedInput';
import LineNumberField from './LineNumberField';
import { useOnFailure, useValidateUnicity } from '../utils/hooks';
import { AsyncAutocompleteInput } from '../utils/components/AsyncAutocompleteInput';
import { transform, styles as createStyles, Wrapper } from './InvoiceCreate';
import { FormTabWithLayout } from './FormTabWithLayout';
import PdfButton from './PdfButton';
import PrintButton from './PrintButton';
import PrintDeliveryOrderButton from './PrintDeliveryOrderButton';
import LineItemsIterator from './LineItemsIterator';
import ReferenceManyFieldWithActions from '../sales_orders/ReferenceManyFieldWithActions';

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
  const [state, setState] = useState({
    // TODO: make use of formProps instead?
    isPaid: props?.record?.status === 'PD',
  });

  /**
   * You can have tooling support which checks and enforces these rules.
   * For example, eslint-plugin-react-hooks utilizes a heuristic that assumes,
   * a function starting with "use" prefix and a capital letter after it is a Hook.
   */

  /// can't use <TabbedForm> since inner layout does not have access to formProps
  /// no access to formProps
  /// need to make it have access to formProps
  /// we need to saving, etc options from react admin
  /// so we using react admin form

  // TODO: add wrapper card component
  // TODO: add custom toolbar

  return (
    <FormWithRedirect
      {...props}
      render={(formProps: any) => {
        // console.log(formProps?.form?.getFieldState('status')?.value);
        return (
          <Card>
            <Wrapper>
              <TabbedFormView
                {...formProps}
                toolbar={
                  <Toolbar
                    // props from react-admin demo VisitorEdit
                    resource="invoices"
                    record={formProps.record}
                    basePath={formProps.basePath}
                    // undoable={true}
                    invalid={formProps.invalid}
                    handleSubmit={formProps.handleSubmit}
                    saving={formProps.saving}
                    pristine={formProps.pristine}
                    classes={{ toolbar: classes.toolbar }}
                  >
                    <SaveButton
                      // props from Toolbar.tsx
                      handleSubmitWithRedirect={
                        formProps.handleSubmitWithRedirect ||
                        formProps.handleSubmit
                      }
                      disabled={formProps.disabled}
                      invalid={formProps.invalid}
                      redirect={formProps.redirect}
                      saving={formProps.saving}
                      submitOnEnter={formProps.submitOnEnter}
                      transform={transform}
                      onFailure={onFailure}
                    />
                    <PdfButton />
                    <PrintButton />
                    <PrintDeliveryOrderButton />
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
                }
              >
                <FormTabWithLayout
                  label="resources.invoices.tabs.details"
                  // contentClassName={classes.tab}
                  /// just take in and not modify children
                >
                  <Box display={{ sm: 'block', md: 'flex' }}>
                    <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
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
                            source="customer"
                            resource="invoices"
                            reference="customers"
                            validate={requiredValidate}
                            fullWidth

                            // helperText="Please select your customer"
                          />
                        </Box>
                        <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                          <AsyncAutocompleteInput
                            optionText="name"
                            optionValue="id"
                            source="salesperson"
                            resource="invoices"
                            reference="employees"
                            fullWidth
                          />
                        </Box>
                      </Box>
                      <RichTextInput source="description" label="" />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                      <Box display={{ sm: 'block', md: 'flex' }}>
                        <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                          <TextInput
                            source="reference"
                            resource="invoices"
                            fullWidth
                            validate={[
                              requiredValidate,
                              validateReferenceUnicity,
                            ]}
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
                          <SelectInput
                            source="status"
                            choices={statuses}
                            fullWidth
                            validate={requiredValidate}
                            onChange={(event: any) => {
                              setState((state) => ({
                                ...state,
                                isPaid: event.target.value === 'PD',
                              }));
                            }}
                          />
                        </Box>
                        <Box flex={1} ml={{ sm: 0, md: '0.5em' }}></Box>
                      </Box>
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
                        <LineItemsIterator resource="invoice_items">
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
                                  inputClassName={
                                    classes.lineItemReferenceInput
                                  }
                                  {...rest}
                                />
                              ) : null
                            }
                          </FormDataConsumer>
                          <NumberInput
                            min={0}
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
                            min={0}
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
                        </LineItemsIterator>
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
                            min={0}
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
                            min={0}
                            source="discount_amount"
                            resource="invoices"
                            fullWidth
                            validate={requiredValidate}
                            disabled
                          />
                        </Box>
                      </Box>
                      <NumberInput
                        min={0}
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
                            min={0}
                            source="gst_rate"
                            resource="invoices"
                            fullWidth
                            validate={requiredValidate}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  %
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                        <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                          <NumberInput
                            min={0}
                            source="gst_amount"
                            resource="invoices"
                            fullWidth
                            validate={requiredValidate}
                            disabled
                          />
                        </Box>
                      </Box>

                      <NumberInput
                        min={0}
                        source="grand_total"
                        resource="invoices"
                        fullWidth
                        validate={requiredValidate}
                        disabled
                      />
                      <Box display={{ sm: 'block', md: 'flex' }}>
                        <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                          <FormDataConsumer>
                            {({ formData }) => (
                              <Labeled label="resources.invoices.fields.credits_available">
                                <ReferenceField
                                  // TODO: use label?
                                  source="customer"
                                  reference="customers"
                                  record={formData}

                                  // label="resources.invoices.fields.credits_available"
                                  // fullWidth
                                  // formClassName={classes.leftFormGroup}
                                  // className={classes.lineItemInput}
                                  // className={classes.lineItemReferenceInput}
                                  // validate={requiredValidate}
                                >
                                  <NumberField
                                    source="unused_credits"
                                    options={{
                                      style: 'currency',
                                      currency: 'SGD',
                                    }}
                                  />
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
                                validate={requiredValidate}
                                disabled
                                {...props}
                              />
                            )}
                          </FormDataConsumer>
                        </Box>
                      </Box>

                      <NumberInput
                        min={0}
                        source="balance_due"
                        resource="invoices"
                        fullWidth
                        validate={requiredValidate}
                        disabled
                      />
                    </Box>
                  </Box>
                </FormTabWithLayout>

                {state.isPaid ? (
                  <FormTabWithLayout
                    /**
                     * TODO: hide tab when unpaid
                     * for some reason, this tab cannot be toggled using
                     * formProps?.form?.getFieldState('status')?.value === 'UPD' ? null : (...)
                     */

                    label="resources.invoices.tabs.record_payment"
                    // hidden={}
                  >
                    <Box
                      display={{ sm: 'block', md: 'flex' }}
                      // hide instead of null so that date is formatted properly
                    >
                      <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                        <DateInput
                          source="payment_date"
                          resource="invoices"
                          fullWidth
                          // disabled={formData && formData.status === 'UPD'}
                        />
                      </Box>
                      <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                        <ReferenceInput
                          source="payment_method"
                          reference="payment_methods"
                          fullWidth
                          // disabled={formData && formData.status === 'UPD'}
                        >
                          <SelectInput source="name" />
                        </ReferenceInput>
                      </Box>
                    </Box>

                    <TextInput
                      source="payment_note"
                      multiline
                      fullWidth
                      // disabled={formData && formData.status === 'UPD'}
                    />
                  </FormTabWithLayout>
                ) : null}

                <FormTabWithLayout label="resources.invoices.tabs.credits_applied">
                  <Card>
                    <CardContent>
                      <ReferenceManyFieldWithActions
                        reference="credits_applications"
                        target="invoice"
                        addLabel={false}
                        pagination={<Pagination />}
                        fullWidth
                        // actions={<InvoiceListActions />}
                      >
                        <Datagrid>
                          <DateField source="date" />
                          <ReferenceField
                            source="credit_note"
                            reference="credit_notes"
                            label="resources.credit_notes.fields.reference"
                            // fullWidth
                            // formClassName={classes.leftFormGroup}
                            // className={classes.lineItemInput}
                            // className={classes.lineItemReferenceInput}
                            // validate={requiredValidate}
                          >
                            <TextField source="reference" />
                          </ReferenceField>
                          <NumberField source="amount_to_credit" />
                          <DeleteButton />
                        </Datagrid>
                      </ReferenceManyFieldWithActions>
                      <ArrayInput
                        source="creditsapplication_set"
                        resource="credits_applications"
                        label="resources.invoices.fields.creditsapplication_set"

                        // validate={requiredValidate}
                      >
                        <SimpleFormIterator
                          resource="credits_applications"
                          // disabled
                          disableAdd
                          disableRemove
                        >
                          <ReferenceInput
                            source="credit_note"
                            reference="credit_notes"
                            label="resources.credit_notes.fields.reference"
                            // fullWidth
                            formClassName={classes.leftFormGroup}
                            // className={classes.lineItemInput}
                            className={classes.lineItemReferenceInput}
                            validate={requiredValidate}
                          >
                            <SelectInput source="reference" />
                          </ReferenceInput>
                          <DateInput
                            source="date"
                            formClassName={classes.leftFormGroup}
                            className={classes.lineItemInput}
                            validate={requiredValidate}
                            initialValue={new Date()}
                            disabled
                          />
                          <TextInput
                            min={0}
                            // TODO: use NumberField instead
                            // TODO: add currency
                            source="credit_note"
                            // label="resources.credit_notes.fields.credits_used"
                            formClassName={classes.leftFormGroup}
                            className={classes.lineItemInput}
                            // validate={requiredValidate}
                            disabled
                          />

                          <NumberInput
                            min={0}
                            // TODO: use NumberField instead
                            // TODO: add currency
                            source="credit_amount"
                            label="resources.credit_notes.fields.credits_used"
                            formClassName={classes.leftFormGroup}
                            className={classes.lineItemInput}
                            // validate={requiredValidate}
                            disabled
                          />

                          <NumberInput
                            /// use number, since it makes changing the field easier
                            min={0}
                            source="credits_available"
                            label="resources.credit_notes.fields.credits_remaining"
                            formClassName={classes.leftFormGroup}
                            className={classes.lineItemInput}
                            validate={requiredValidate}
                            disabled
                          />

                          <NumberInput
                            min={0}
                            source="amount_to_credit"
                            formClassName={classes.leftFormGroup}
                            className={classes.lineItemInput}
                            validate={requiredValidate}
                          />
                        </SimpleFormIterator>
                      </ArrayInput>
                    </CardContent>
                  </Card>
                </FormTabWithLayout>
              </TabbedFormView>
            </Wrapper>
          </Card>
        );
      }}
    />
  );
};

const requiredValidate = required();

export default InvoiceEdit;

/*
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
*/

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

/*
      <FormWithRedirect /// cannot be nested
      /// only one <form>
        {...props}
        render={(formProps: any) => {
          console.log('formprops', formProps);

          return (

          );
        }}
      />
*/
