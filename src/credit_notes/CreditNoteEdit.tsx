import { FC } from "react";
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
  SaveButton,
  DeleteButton,
  TextField,
  ReferenceField,
  TabbedFormView,
  Datagrid,
  DateField,
  NumberField,
  Pagination,
  useNotify,
  useRefresh,
  Record,
  number,
  minValue,
} from "react-admin";
import { Box, Card, CardContent, InputAdornment } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import RichTextInput from "ra-input-rich-text";
import { withStyles } from "@material-ui/core/styles";

import { statuses } from "./data";
import ProductNameInput from "../invoices/fields/ProductNameInput";
import TotalInput from "./TotalInput";
import { validateUnicity } from "../utils";

import { memoize } from "../utils";
import { useOnFailure } from "../utils/hooks";
import { AsyncAutocompleteInput } from "../utils/components/AsyncAutocompleteInput";
import { transform, styles as createStyles } from "./CreditNoteCreate";
import { FormTabWithLayout } from "../invoices/utils/FormTabWithCustomLayout";
import PdfButton from "../invoices/buttons/PdfButton";
import LineItemsIterator from "../invoices/LineItemsIterator";
import ReferenceManyFieldWithActions from "./ReferenceManyFieldWithActions";

const useStyles = makeStyles({
  ...createStyles,
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
});

const Wrapper = withStyles((theme) => ({
  root: {
    padding: 0,
    "&:last-child": {
      paddingBottom: 0,
    },
  },
}))(CardContent);

const CreditNoteEdit: FC<EditProps> = (props) => {
  const notify = useNotify();
  const refresh = useRefresh();

  const onSuccess = ({ data }: { data: Record }) => {
    notify(`Changes to "${data.reference}" saved`);
    refresh();
  };

  const onFailure = (error: any) => {
    notify(
      typeof error === "string"
        ? error
        : error.message || "ra.notification.http_error",
      "warning"
    );
  };

  return (
    <Edit
      component="div"
      onSuccess={onSuccess}
      onFailure={onFailure}
      mutationMode="pessimistic"
      {...props}
    >
      <CreditNoteForm />
    </Edit>
  );
};

const CreditNoteForm = (props: any) => {
  const classes = useStyles();
  const onFailure = useOnFailure();

  return (
    <FormWithRedirect
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
                    resource="sales_orders"
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
                <FormTabWithLayout label="resources.credit_notes.tabs.details">
                  <Box display={{ sm: "block", md: "flex" }}>
                    <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
                      <DateInput
                        source="date"
                        resource="credit_notes"
                        fullWidth
                        validate={requiredValidate}
                      />

                      <Box display={{ sm: "block", md: "flex" }}>
                        <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
                          <AsyncAutocompleteInput
                            optionText="name"
                            optionValue="id"
                            source="customer"
                            resource="credit_notes"
                            reference="customers"
                            validate={requiredValidate}
                            fullWidth
                          />
                        </Box>
                        <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
                          <AsyncAutocompleteInput
                            optionText="name"
                            optionValue="id"
                            source="salesperson"
                            resource="credit_notes"
                            reference="employees"
                            fullWidth
                          />
                        </Box>
                      </Box>
                      <RichTextInput source="description" label="" />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
                      <Box display={{ sm: "block", md: "flex" }}>
                        <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
                          <TextInput
                            source="reference"
                            resource="credit_notes"
                            fullWidth
                            validate={validateReference(props)}
                          />
                        </Box>
                        <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
                          <TextInput
                            source="created_from"
                            resource="credit_note"
                            fullWidth
                            disabled
                          />
                        </Box>
                      </Box>
                      <Box display={{ sm: "block", md: "flex" }}>
                        <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
                          <SelectInput
                            source="status"
                            choices={statuses}
                            fullWidth
                            validate={requiredValidate}
                          />
                        </Box>
                        <Box flex={1} ml={{ sm: 0, md: "0.5em" }}></Box>
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
                                  source={getSource("product")}
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
                                  source={getSource("amount")}
                                  getSource={getSource}
                                  inputClassName={classes.lineItemInput}
                                  // FIXME: error thrown if do no pass save and saving as strings
                                  // hint: this happened because props are injected into react element
                                  // instead of NumberInput

                                  {...rest}
                                />
                              ) : null
                            }
                          </FormDataConsumer>
                        </LineItemsIterator>
                      </ArrayInput>
                    </CardContent>
                  </Card>
                  <Box display={{ sm: "block", md: "flex" }}>
                    <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
                      <FormDataConsumer>
                        {(props) => (
                          <TotalInput
                            source="total_amount"
                            resource="credit_notes"
                            fullWidth
                            disabled
                            {...props}
                          />
                        )}
                      </FormDataConsumer>
                      <Box display={{ sm: "block", md: "flex" }}>
                        <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
                          <NumberInput
                            source="discount_rate"
                            resource="credit_notes"
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
                        <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
                          <NumberInput
                            source="discount_amount"
                            resource="credit_notes"
                            fullWidth
                            disabled
                          />
                        </Box>
                      </Box>
                      <NumberInput
                        source="net"
                        resource="credit_notes"
                        fullWidth
                        disabled
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
                      <Box display={{ sm: "block", md: "flex" }}>
                        <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
                          <NumberInput
                            source="gst_rate"
                            resource="credit_notes"
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
                        <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
                          <NumberInput
                            source="gst_amount"
                            resource="credit_notes"
                            fullWidth
                            disabled
                          />
                        </Box>
                      </Box>
                      <NumberInput
                        source="grand_total"
                        resource="credit_notes"
                        fullWidth
                        disabled
                      />
                      <Box display={{ sm: "block", md: "flex" }}>
                        <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
                          <NumberInput
                            source="credits_used"
                            resource="credit_notes"
                            fullWidth
                            disabled
                          />
                        </Box>
                        <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
                          <NumberInput
                            source="refund"
                            resource="credit_notes"
                            fullWidth
                          />
                        </Box>
                      </Box>
                      <NumberInput
                        source="credits_remaining"
                        resource="credit_notes"
                        fullWidth
                        disabled
                      />
                    </Box>
                  </Box>
                </FormTabWithLayout>
                <FormTabWithLayout label="resources.credit_notes.tabs.invoices_credited">
                  <ReferenceManyFieldWithActions
                    reference="credits_applications"
                    target="credit_note"
                    addLabel={false}
                    pagination={<Pagination />}
                    fullWidth
                  >
                    <Datagrid>
                      <DateField source="date" />
                      <ReferenceField
                        source="invoice"
                        reference="invoices"
                        label="resources.invoices.fields.reference"
                      >
                        <TextField source="reference" />
                      </ReferenceField>
                      <NumberField
                        source="amount_to_credit"
                        label="resources.invoices.fields.credits_applied"
                      />
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
const validateNumber = [requiredValidate, number(), minValue(0)];
const validateReferenceUnicity = (props: any) =>
  validateUnicity({
    reference: "credit_notes",
    source: "reference",
    record: props.record,
    message: "resources.credit_notes.validation.reference_already_used",
  });
const validateReference = memoize((props: any) => [
  requiredValidate,
  validateReferenceUnicity(props),
]);

export default CreditNoteEdit;
