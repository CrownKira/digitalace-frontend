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
  SelectInput,
  FormDataConsumer,
  Loading,
  useGetList,
  ReferenceInput,
  SaveButton,
  Labeled,
  TextField,
  Record,
  ReferenceField,
  TabbedFormView,
  number,
  minValue,
  maxValue,
  NumberField,
} from 'react-admin';
import { Box, Card, CardContent, InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RichTextInput from 'ra-input-rich-text';
import useGetUserConfig from '../configuration/useGetUserConfig';
import { withStyles } from '@material-ui/core/styles';
import { AnyObject } from 'react-final-form';

import { statuses } from './data';
import ProductNameInput from './ProductNameInput';
import AmountInput from './AmountInput';
import TotalInput from './TotalInput';
import CreditsAppliedInput from './CreditsAppliedInput';
import LineNumberField from './LineNumberField';
import { AsyncAutocompleteInput } from '../utils/components/AsyncAutocompleteInput';
import { Invoice } from '../types';
import { incrementReference, dateParser, validateUnicity } from '../utils';
import { memoize } from '../utils';
import { useOnFailure } from '../utils/hooks';
import { FormTabWithLayout } from '../invoices/FormTabWithLayout';
import PdfButton from '../invoices/PdfButton';
import PrintButton from '../invoices/PrintButton';
import PrintDeliveryOrderButton from '../invoices/PrintDeliveryOrderButton';
import LineItemsIterator from '../invoices/LineItemsIterator';
import CreditsApplicationListActions from './CreditsApplicationListActions';
import CustomerNameInput from './CustomerNameInput';
import { PriceField } from '../utils/components/PriceField';
import ApplyCreditsCard from './ApplyCreditsCard';

export const styles = {
  leftFormGroup: { display: 'inline-block', marginRight: '0.5em' },
  rightFormGroup: {
    display: 'inline-block',
  },
  lineItemInput: { width: 150 },
  lineItemReferenceInput: { width: 300 },
  hiddenInput: {
    display: 'none',
  },
  label: {
    padding: '1em',
  },
};

const useStyles = makeStyles(styles);

// TODO: move to utils
export const Wrapper = withStyles((theme) => ({
  root: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0,
    },
  },
}))(CardContent);

const InvoiceCreate: FC<CreateProps> = (props) => {
  return (
    <Create component="div" {...props}>
      <InvoiceForm />
    </Create>
  );
};

export const validateForm = ({ credits_applied, grand_total }: AnyObject) => {
  const errors = {} as any;

  if (Number(credits_applied) > Number(grand_total)) {
    errors.credits_applied = ['resources.invoices.validation.invalid_credits'];
  }

  return errors;
};

// a fix for DateField parse not working
export const transform = ({
  fake_creditsapplication_set,
  ...data
}: Record) => ({
  ...data,
  date: dateParser(data.date),
  payment_date: dateParser(data.payment_date),
  creditsapplication_set: fake_creditsapplication_set, // TODO: better way to not pre-fill but send data?
});

const InvoiceForm = (props: any) => {
  const classes = useStyles();
  const [state, setState] = useState({
    // TODO: make use of formProps instead?
    isPaid: props?.record?.status === 'PD',
    openApplyCredits: false,
  });

  const onFailure = useOnFailure();

  const {
    data: invoices,
    ids: invoiceIds,
    loading: loadingInvoices,
  } = useGetList<Invoice>(
    'invoices',
    { page: 1, perPage: 1 },
    { field: 'id', order: 'DESC' },
    {}
  );
  const { loading: loadingUserConfig, data: userConfig } = useGetUserConfig();

  const postDefaultValue = () => ({
    reference:
      invoices && invoiceIds.length > 0
        ? incrementReference(invoices[invoiceIds[0]].reference, 'INV', 4)
        : 'INV-0000',
    sales_order: null,
    date: new Date(),
    // FIXME: default to null date instead
    payment_date: new Date(),
    status: 'UPD',
    total_amount: '0.00',
    discount_rate: userConfig?.discount_rate,
    discount_amount: '0.00',
    net: '0.00',
    gst_rate: userConfig?.gst_rate,
    gst_amount: '0.00',
    grand_total: '0.00',
    credits_available: '0.00',
    credits_applied: '0.00',
    balance_due: '0.00',
    fake_creditsapplication_set: [],
  });

  return loadingInvoices || loadingUserConfig ? (
    <Loading />
  ) : (
    <FormWithRedirect
      initialValues={postDefaultValue}
      validate={validateForm}
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
                    // classes={{ toolbar: classes.toolbar }}
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
                          <CustomerNameInput
                            onChange={() => {
                              setState({
                                ...state,
                                openApplyCredits: false,
                              });
                            }}
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
                            validate={validateReference(props)}
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
                            source="quantity"
                            formClassName={classes.leftFormGroup}
                            className={classes.lineItemInput}
                            validate={validateNumber}
                          />
                          <TextInput
                            source="unit"
                            formClassName={classes.leftFormGroup}
                            className={classes.lineItemInput}
                            disabled
                          />
                          <NumberInput
                            source="unit_price"
                            formClassName={classes.leftFormGroup}
                            className={classes.lineItemInput}
                            validate={validateNumber}
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
                      <NumberInput
                        source="net"
                        resource="invoices"
                        fullWidth
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
                            validate={validateNumber}
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
                  <FormDataConsumer>
                    {({ formData }) => (
                      <CreditsApplicationListActions
                        onClick={() => {
                          setState({ ...state, openApplyCredits: true });
                        }}
                        // TODO: use form.getState() instead?
                        formData={formData}
                        disabled={state.openApplyCredits}
                      />
                    )}
                  </FormDataConsumer>

                  {state.openApplyCredits ? (
                    <ApplyCreditsCard formProps={formProps} />
                  ) : null}
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
const validateNumber = [requiredValidate, number(), minValue(0)];
const validateReferenceUnicity = (props: any) =>
  validateUnicity({
    reference: 'invoices',
    source: 'reference',
    record: props.record,
    message: 'resources.invoices.validation.reference_already_used',
  });
const validateReference = memoize((props: any) => [
  requiredValidate,
  validateReferenceUnicity(props),
]);
export const validateCredits = (scopedFormData: any) => [
  number(),
  minValue(0),
  maxValue(Number(scopedFormData?.credits_remaining)),
];

export default InvoiceCreate;
