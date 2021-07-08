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
  TabbedFormView,
  ReferenceField,
  DateField,
  TextField,
  NumberField,
  DeleteButton,
  Datagrid,
  Pagination,
  Labeled,
  useNotify,
  useRefresh,
  Record,
  number,
  minValue,
} from 'react-admin';
import { Box, Card, CardContent, InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RichTextInput from 'ra-input-rich-text';

import { statuses } from './data';
import ProductNameInput from './ProductNameInput';
import TotalInput from './TotalInput';
import CreditsAppliedInput from './CreditsAppliedInput';
import { memoize } from '../utils';
import { useOnFailure } from '../utils/hooks';
import { AsyncAutocompleteInput } from '../utils/components/AsyncAutocompleteInput';
import {
  transform,
  styles as createStyles,
  Wrapper,
  validateForm,
} from './InvoiceCreate';
import { FormTabWithLayout } from './FormTabWithLayout';
import PdfButton from './PdfButton';
import PrintButton from './PrintButton';
import LineItemsIterator from './LineItemsIterator';
import ReferenceManyFieldWithActions from '../sales_orders/ReferenceManyFieldWithActions';
import CustomerNameInput from './CustomerNameInput';
import { validateUnicity } from '../utils';
import CreditsApplicationListActions from './CreditsApplicationListActions';
import { PriceField } from '../utils/components/PriceField';
import ApplyCreditsCard from './ApplyCreditsCard';

const useStyles = makeStyles({
  ...createStyles,
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

const InvoiceEdit: FC<EditProps> = (props) => {
  return (
    <Edit component="div" mutationMode="pessimistic" {...props}>
      <InvoiceForm />
    </Edit>
  );
};

const InvoiceForm = (props: any) => {
  const classes = useStyles();
  const onFailure = useOnFailure();

  const [state, setState] = useState({
    // TODO: make use of formProps instead?
    isPaid: props?.record?.status === 'PD',
    openApplyCredits: false,
  });

  const refresh = useRefresh();
  const notify = useNotify();

  const onSuccess = ({ data }: { data: Record }) => {
    notify(`Changes to "${data.reference}" saved`);
    setState({ ...state, openApplyCredits: false });
    refresh();
  };

  /**
   * You can have tooling support which checks and enforces these rules.
   * For example, eslint-plugin-react-hooks utilizes a heuristic that assumes,
   * a function starting with "use" prefix and a capital letter after it is a Hook.
   */

  // TODO: add wrapper card component
  // TODO: add custom toolbar

  return (
    <FormWithRedirect
      validate={validateForm}
      {...props}
      render={(formProps: any) => {
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
                    invalid={formProps.invalid}
                    handleSubmit={formProps.handleSubmit}
                    saving={formProps.saving}
                    pristine={formProps.pristine}
                    classes={{ toolbar: classes.toolbar }}
                  >
                    <SaveButton
                      // props from Toolbar.tsx
                      // TODO: disable when pristine?
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
                      onSuccess={onSuccess}
                    />
                    <PdfButton />
                    <PrintButton />
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
                <FormTabWithLayout label="resources.invoices.tabs.details">
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
                            // TODO: wrap all AsyncAutocompleteInput, to be shared by other documents
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
                          <NumberInput
                            source="amount"
                            formClassName={classes.rightFormGroup}
                            className={classes.lineItemInput}
                          />
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
                </FormTabWithLayout>
                {state.isPaid ? (
                  <FormTabWithLayout
                    /**
                     * TODO: hide tab when unpaid
                     * for some reason, this tab cannot be toggled using
                     * formProps?.form?.getFieldState('status')?.value === 'UPD' ? null : (...)
                     */
                    label="resources.invoices.tabs.record_payment"
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

                    <TextInput source="payment_note" multiline fullWidth />
                  </FormTabWithLayout>
                ) : null}
                <FormTabWithLayout label="resources.invoices.tabs.credits_applied">
                  <FormDataConsumer>
                    {({ formData }) => (
                      <ReferenceManyFieldWithActions
                        reference="credits_applications"
                        target="invoice"
                        addLabel={false}
                        pagination={<Pagination />}
                        fullWidth
                        actions={
                          <CreditsApplicationListActions
                            onClick={() => {
                              setState({ ...state, openApplyCredits: true });
                            }}
                            formData={formData}
                            disabled={state.openApplyCredits}
                          />
                        }
                      >
                        <Datagrid>
                          <DateField source="date" />
                          <ReferenceField
                            source="credit_note"
                            reference="credit_notes"
                          >
                            <TextField source="reference" />
                          </ReferenceField>
                          <NumberField
                            label="resources.invoices.fields.credits_applied"
                            source="amount_to_credit"
                          />
                          <DeleteButton
                            mutationMode="pessimistic"
                            redirect={false}
                          />
                        </Datagrid>
                      </ReferenceManyFieldWithActions>
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

// TODO: put in utils
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

export default InvoiceEdit;
