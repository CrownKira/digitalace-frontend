import { FC, cloneElement } from 'react';
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
  // SimpleFormIterator,
  SelectInput,
  FormDataConsumer,
  SaveButton,
  DeleteButton,
  Labeled,
  TextField,
  ReferenceField,
  TabbedFormView,
  ReferenceManyField,
  Datagrid,
  DateField,
  SelectField,
  NumberField,
  Pagination,
  EditButton,
  TopToolbar,
  CreateButton,
  ExportButton,
} from 'react-admin';
import { Box, Card, CardContent, InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RichTextInput from 'ra-input-rich-text';
import { withStyles } from '@material-ui/core/styles';

import { statuses } from './data';
import ProductNameInput from '../invoices/ProductNameInput';
import AmountInput from '../invoices/AmountInput';
import TotalInput from './TotalInput';
import LineNumberField from './LineNumberField';
import {} from '../utils';
import { useOnFailure, useValidateUnicity } from '../utils/hooks';
import { AsyncAutocompleteInput } from '../utils/components/AsyncAutocompleteInput';
import { transform, styles as createStyles } from './SalesOrderCreate';
import { FormTabWithLayout } from '../invoices/FormTabWithLayout';
import PdfButton from '../invoices/PdfButton';
import PrintButton from '../invoices/PrintButton';
import PrintDeliveryOrderButton from '../invoices/PrintDeliveryOrderButton';
import LineItemsIterator from '../invoices/LineItemsIterator';
import { statuses as invoiceStatuses } from '../invoices/data';
import ReferenceManyFieldWithActions from './ReferenceManyFieldWithActions';

const useStyles = makeStyles({
  ...createStyles,
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

const Wrapper = withStyles((theme) => ({
  root: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0,
    },
  },
}))(CardContent);

const SalesOrderEdit: FC<EditProps> = (props) => {
  return (
    <Edit component="div" {...props}>
      <SalesOrderForm />
    </Edit>
  );
};

// FIXME: fix any
const InvoiceListActions = (props: any) => (
  <TopToolbar>
    <CreateButton />
  </TopToolbar>
);

const SalesOrderForm = (props: any) => {
  const classes = useStyles();
  const onFailure = useOnFailure();
  const validateReferenceUnicity = useValidateUnicity({
    reference: 'sales_orders',
    source: 'reference',
    record: props.record,
    message: 'resources.sales_orders.validation.reference_already_used',
  });

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
                    resource="sales_orders"
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
                  label="resources.sales_orders.tabs.details"
                  // contentClassName={classes.tab}
                  /// just take in and not modify children
                >
                  <Box display={{ sm: 'block', md: 'flex' }}>
                    <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                      <DateInput
                        source="date"
                        resource="sales_orders"
                        fullWidth
                        validate={requiredValidate}
                      />

                      <Box display={{ sm: 'block', md: 'flex' }}>
                        <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                          <AsyncAutocompleteInput
                            optionText="name"
                            optionValue="id"
                            source="customer"
                            resource="sales_orders"
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
                            resource="sales_orders"
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
                            resource="sales_orders"
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
                            resource="sales_orders"
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
                          />
                        </Box>
                        <Box flex={1} ml={{ sm: 0, md: '0.5em' }}></Box>
                      </Box>
                    </Box>
                  </Box>
                  <Card>
                    <CardContent>
                      <ArrayInput
                        source="salesorderitem_set"
                        resource="sales_order_items"
                        label="resources.sales_orders.fields.salesorderitem_set"
                        validate={requiredValidate}
                      >
                        <LineItemsIterator resource="sales_order_items">
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
                            resource="sales_orders"
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
                            resource="sales_orders"
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
                            resource="sales_orders"
                            fullWidth
                            validate={requiredValidate}
                            disabled
                          />
                        </Box>
                      </Box>
                      <NumberInput
                        min={0}
                        source="net"
                        resource="sales_orders"
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
                            resource="sales_orders"
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
                            resource="sales_orders"
                            fullWidth
                            validate={requiredValidate}
                            disabled
                          />
                        </Box>
                      </Box>
                      <NumberInput
                        min={0}
                        source="grand_total"
                        resource="sales_orders"
                        fullWidth
                        validate={requiredValidate}
                        disabled
                      />
                    </Box>
                  </Box>
                </FormTabWithLayout>

                <FormTabWithLayout
                  label="resources.sales_orders.tabs.invoices"
                  // contentClassName={classes.tab}
                  /// just take in and not modify children
                >
                  <ReferenceManyFieldWithActions
                    reference="invoices"
                    target="sales_order"
                    addLabel={false}
                    pagination={<Pagination />}
                    fullWidth
                    actions={<InvoiceListActions />}
                  >
                    <Datagrid>
                      <TextField source="reference" />
                      <DateField source="date" />
                      <SelectField
                        // TODO: use chip
                        // https://marmelab.com/react-admin/Fields.html#choice-fields
                        source="status"
                        choices={invoiceStatuses}
                      />
                      <NumberField source="grand_total" />
                      <EditButton />
                    </Datagrid>
                  </ReferenceManyFieldWithActions>
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

export default SalesOrderEdit;
