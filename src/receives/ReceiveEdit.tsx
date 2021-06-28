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
  Labeled,
  TextField,
  ReferenceField,
} from 'react-admin';
import { Box, Card, CardContent, InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RichTextInput from 'ra-input-rich-text';

import { statuses } from '../invoices/data';
import ProductNameInput from '../invoices/ProductNameInput';
import AmountInput from '../invoices/AmountInput';
import TotalInput from './TotalInput';
import LineNumberField from './LineNumberField';
import { AsyncAutocompleteInput } from '../utils/components/AsyncAutocompleteInput';
import { transform, styles as createStyles } from './ReceiveCreate';

const useStyles = makeStyles({
  ...createStyles,
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

const ReceiveEdit: FC<EditProps> = (props) => {
  return (
    <Edit component="div" {...props}>
      <ReceiveForm />
    </Edit>
  );
};

const ReceiveForm = (props: any) => {
  const classes = useStyles();

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
                        resource="receives"
                        fullWidth
                        validate={requiredValidate}
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                      <AsyncAutocompleteInput
                        optionText="reference"
                        optionValue="id"
                        source="purchase_order"
                        resource="receives"
                        reference="purchase_orders"
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
                        resource="receives"
                        reference="suppliers"
                        validate={requiredValidate}
                        fullWidth
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                      <FormDataConsumer>
                        {({ formData }) => (
                          <Labeled label="resources.receives.fields.supplier_id">
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
                    resource="receives"
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
                            resource="receives"
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
                    source="receiveitem_set"
                    resource="receive_items"
                    label="resources.receives.fields.receiveitem_set"
                    validate={requiredValidate}
                  >
                    <SimpleFormIterator resource="receive_items">
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
                        resource="receives"
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
                        resource="receives"
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
                        resource="receives"
                        fullWidth
                        validate={requiredValidate}
                        disabled
                      />
                    </Box>
                  </Box>
                  <NumberInput
                    source="net"
                    resource="receives"
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
                        resource="receives"
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
                        resource="receives"
                        fullWidth
                        validate={requiredValidate}
                        disabled
                      />
                    </Box>
                  </Box>
                  <NumberInput
                    source="grand_total"
                    resource="receives"
                    fullWidth
                    validate={requiredValidate}
                    disabled
                  />
                  <FormDataConsumer>
                    {(props) => (
                      <LineNumberField
                        source="total_lines"
                        resource="receives"
                        fullWidth
                        label="resources.receives.fields.total_lines"
                        {...props}
                      />
                    )}
                  </FormDataConsumer>
                </Box>
              </Box>
            </CardContent>
            <Toolbar
              // props from react-admin demo VisitorEdit
              resource="receives"
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
              />
              {formProps.record && typeof formProps.record.id !== 'undefined' && (
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

const requiredValidate = [required()];

export default ReceiveEdit;
