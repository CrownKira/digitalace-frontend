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
import {} from '../utils';
import { useOnFailure, useValidateUnicity } from '../utils/hooks';
import { AsyncAutocompleteInput } from '../utils/components/AsyncAutocompleteInput';
import { CreditNote } from '../types';
import { incrementReference, dateParser } from '../utils';
import LineItemsIterator from '../invoices/LineItemsIterator';

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
};

const useStyles = makeStyles(styles);

const CreditNoteCreate: FC<CreateProps> = (props) => {
  return (
    <Create component="div" {...props}>
      <CreditNoteForm />
    </Create>
  );
};

// a fix for DateField parse not working
export const transform = (data: Record) => ({
  ...data,
  date: dateParser(data.date),
  payment_date: dateParser(data.payment_date),
});

const CreditNoteForm = (props: any) => {
  const classes = useStyles();
  const onFailure = useOnFailure();
  const validateReferenceUnicity = useValidateUnicity({
    reference: 'credit_notes',
    source: 'reference',
    message: 'resources.credit_notes.validation.reference_already_used',
  });

  const {
    data: credit_notes,
    ids: salesOrderIds,
    loading: loadingCreditNotes,
  } = useGetList<CreditNote>(
    'credit_notes',
    { page: 1, perPage: 1 },
    { field: 'id', order: 'DESC' },
    {}
  );
  const { loading: loadingUserConfig, data: userConfig } = useGetUserConfig();

  const postDefaultValue = () => ({
    reference:
      credit_notes &&
      salesOrderIds.length > 0 &&
      credit_notes[salesOrderIds[0]].reference
        ? incrementReference(credit_notes[salesOrderIds[0]].reference, 'CN', 4)
        : 'CN-0000',
    date: new Date(),
    invoice: null,
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
    credits_used: '0.00',
    credits_remaining: '0.00',
    refund: '0.00',
  });

  // TODO: add apply to invoice tab
  return loadingCreditNotes || loadingUserConfig ? (
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
                  <DateInput
                    source="date"
                    resource="credit_note"
                    fullWidth
                    validate={requiredValidate}
                  />

                  <Box display={{ sm: 'block', md: 'flex' }}>
                    <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                      <AsyncAutocompleteInput
                        optionText="name"
                        optionValue="id"
                        source="customer"
                        resource="credit_note"
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
                        resource="credit_note"
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
                        resource="credit_note"
                        fullWidth
                        validate={[requiredValidate, validateReferenceUnicity]}
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                      <TextInput
                        source="created_from"
                        resource="credit_note"
                        fullWidth
                        // validate={[requiredValidate, validateReferenceUnicity]}
                        disabled
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
                    source="creditnoteitem_set"
                    resource="credit_note_items"
                    label="resources.credit_notes.fields.creditnoteitem_set"
                    validate={requiredValidate}
                  >
                    <LineItemsIterator resource="credit_note_items">
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
                              inputClassName={classes.lineItemReferenceInput}
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
                        resource="credit_note"
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
                        resource="credit_note"
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
                        resource="credit_note"
                        fullWidth
                        validate={requiredValidate}
                        disabled
                      />
                    </Box>
                  </Box>
                  <NumberInput
                    min={0}
                    source="net"
                    resource="credit_note"
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
                        resource="credit_note"
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
                        min={0}
                        source="gst_amount"
                        resource="credit_note"
                        fullWidth
                        validate={requiredValidate}
                        disabled
                      />
                    </Box>
                  </Box>
                  <NumberInput
                    min={0}
                    source="grand_total"
                    resource="credit_notes"
                    fullWidth
                    validate={requiredValidate}
                    disabled
                  />
                  <Box display={{ sm: 'block', md: 'flex' }}>
                    <Box flex={1} mr={{ sm: 0, md: '0.5em' }}>
                      <FormDataConsumer>
                        {({ formData }) => (
                          <NumberInput
                            min={0}
                            max={formData.grand_total - formData.refund}
                            source="credits_used"
                            resource="credit_notes"
                            fullWidth
                            disabled
                          />
                        )}
                      </FormDataConsumer>
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: '0.5em' }}>
                      <FormDataConsumer>
                        {({ formData }) => (
                          <NumberInput
                            min={0}
                            max={formData.grand_total - formData.credits_used}
                            source="refund"
                            resource="credit_notes"
                            fullWidth
                          />
                        )}
                      </FormDataConsumer>
                    </Box>
                  </Box>
                  <NumberInput
                    min={0}
                    source="credits_remaining"
                    resource="credit_notes"
                    fullWidth
                    disabled
                  />
                </Box>
              </Box>
            </CardContent>
            <Toolbar
              // props from react-admin demo VisitorEdit
              resource="credit_notes"
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

const requiredValidate = required();

export default CreditNoteCreate;
