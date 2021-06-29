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
  SelectInput,
  FormDataConsumer,
  Loading,
  useGetList,
  SaveButton,
  Labeled,
  TextField,
  Record,
  ReferenceField,
} from 'react-admin';
import { Box, Card, CardContent, InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RichTextInput from 'ra-input-rich-text';
import useGetUserConfig from '../configuration/useGetUserConfig';

import { statuses } from './data';
import ProductNameInput from '../invoices/ProductNameInput';
import AmountInput from '../invoices/AmountInput';
import TotalInput from './TotalInput';
import LineNumberField from './LineNumberField';
import { AsyncAutocompleteInput } from '../utils/components/AsyncAutocompleteInput';
import { PurchaseOrder } from '../types';
import { incrementReference, dateParser } from '../utils';
import { useOnFailure, useValidateUnicity } from '../utils/hooks';

export const styles = {
  leftFormGroup: { display: 'inline-block', marginRight: '0.5em' },
  rightFormGroup: {
    display: 'inline-block',
  },
  lineItemInput: { width: 150 },
  productInput: { width: 250 },
  hiddenInput: {
    display: 'none',
  },
};

const useStyles = makeStyles(styles);

const PurchaseOrderCreate: FC<CreateProps> = (props) => {
  return (
    <Create component="div" {...props}>
      <PurchaseOrderForm />
    </Create>
  );
};

// a fix for DateField parse not working
export const transform = (data: Record) => ({
  ...data,
  date: dateParser(data.date),
  payment_date: dateParser(data.payment_date),
});

const PurchaseOrderForm = (props: any) => {
  const classes = useStyles();
  const onFailure = useOnFailure();
  const validateReferenceUnicity = useValidateUnicity({
    reference: 'purchase_orders',
    source: 'reference',
    message: 'resources.purchase_orders.validation.reference_already_used',
  });

  const {
    data: purchase_orders,
    ids: purchaseOrderIds,
    loading: loadingPurchaseOrders,
  } = useGetList<PurchaseOrder>(
    'purchase_orders',
    { page: 1, perPage: 1 },
    { field: 'id', order: 'DESC' },
    {}
  );
  const { loading: loadingUserConfig, data: userConfig } = useGetUserConfig();

  const postDefaultValue = () => ({
    reference:
      purchase_orders &&
      purchaseOrderIds.length > 0 &&
      purchase_orders[purchaseOrderIds[0]].reference
        ? incrementReference(
            purchase_orders[purchaseOrderIds[0]].reference,
            'PO',
            4
          )
        : 'PO-0000',
    date: new Date(),
    receive: null,
    // FIXME: default to null date instead
    payment_date: new Date(),
    status: 'PD',
    total_amount: '0.00',
    discount_rate: userConfig?.discount_rate,
    discount_amount: '0.00',
    net: '0.00',
    gst_rate: userConfig?.gst_rate,
    gst_amount: '0.00',
    grand_total: '0.00',
  });

  return loadingPurchaseOrders || loadingUserConfig ? (
    <Loading />
  ) : (
    <FormWithRedirect
      {...props}
      initialValues={postDefaultValue}
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
                        resource="purchase_orders"
                        fullWidth
                        validate={[
                          ...requiredValidate,
                          validateReferenceUnicity,
                        ]}
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                      <AsyncAutocompleteInput
                        optionText="reference"
                        optionValue="id"
                        source="receive"
                        resource="purchase_orders"
                        reference="receives"
                        fullWidth
                      />
                    </Box>
                  </Box>
                  <Box display={{ sm: 'block', md: 'flex' }}>
                    <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                      <AsyncAutocompleteInput
                        optionText="name"
                        optionValue="id"
                        source="supplier"
                        resource="purchase_orders"
                        reference="suppliers"
                        validate={requiredValidate}
                        fullWidth
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                      <FormDataConsumer>
                        {({ formData }) => (
                          <Labeled label="resources.purchase_orders.fields.supplier_id">
                            <ReferenceField
                              source="supplier"
                              reference="suppliers"
                              record={formData}
                            >
                              <TextField source="reference" />
                            </ReferenceField>
                          </Labeled>
                        )}
                      </FormDataConsumer>
                    </Box>
                  </Box>
                  <RichTextInput source="description" label="" />
                </Box>
                <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                  <DateInput
                    source="date"
                    resource="purchase_orders"
                    fullWidth
                    validate={requiredValidate}
                  />
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
                    source="purchaseorderitem_set"
                    resource="purchase_order_items"
                    label="resources.purchase_orders.fields.purchaseorderitem_set"
                    validate={requiredValidate}
                  >
                    <SimpleFormIterator resource="purchase_order_items">
                      <FormDataConsumer formClassName={classes.leftFormGroup}>
                        {({ getSource, ...rest }) =>
                          getSource ? (
                            <ProductNameInput
                              source={getSource('product')}
                              getSource={getSource}
                              fullWidth
                              inputClassName={classes.productInput}
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
                        resource="purchase_orders"
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
                        resource="purchase_orders"
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
                        source="discount_amount"
                        resource="purchase_orders"
                        fullWidth
                        validate={requiredValidate}
                        disabled
                      />
                    </Box>
                  </Box>
                  <NumberInput
                    source="net"
                    resource="purchase_orders"
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
                        resource="purchase_orders"
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
                        resource="purchase_orders"
                        fullWidth
                        validate={requiredValidate}
                        disabled
                      />
                    </Box>
                  </Box>
                  <NumberInput
                    source="grand_total"
                    resource="purchase_orders"
                    fullWidth
                    validate={requiredValidate}
                    disabled
                  />
                  <FormDataConsumer>
                    {(props) => (
                      <LineNumberField
                        source="total_lines"
                        resource="purchase_orders"
                        fullWidth
                        label="resources.purchase_orders.fields.total_lines"
                        {...props}
                      />
                    )}
                  </FormDataConsumer>
                </Box>
              </Box>
            </CardContent>
            <Toolbar
              // props from react-admin demo VisitorEdit
              resource="purchase_orders"
              record={formProps.record}
              basePath={formProps.basePath}
              undoable={true}
              invalid={formProps.invalid}
              handleSubmit={formProps.handleSubmit}
              saving={formProps.saving}
              pristine={formProps.pristine}
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
            </Toolbar>
          </form>
        </Card>
      )}
    />
  );
};

const requiredValidate = [required()];

export default PurchaseOrderCreate;
