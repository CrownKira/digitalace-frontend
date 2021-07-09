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
  SimpleFormIterator,
  SelectInput,
  FormDataConsumer,
  ReferenceInput,
  SaveButton,
  DeleteButton,
  Labeled,
  TextField,
  ReferenceField,
  useNotify,
  useRefresh,
  Record,
  number,
  minValue,
} from "react-admin";
import { Box, Card, CardContent, InputAdornment } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import RichTextInput from "ra-input-rich-text";

import { statuses } from "../invoices/data";
import ProductNameInput from "../invoices/fields/ProductNameInput";
import AmountInput from "../transactions/invoices/AmountInput";
import TotalInput from "./TotalInput";
import LineNumberField from "./LineNumberField";
import { validateUnicity } from "../../utils";
import { memoize } from "../../utils";
import { useOnFailure } from "../../utils/hooks";
import { AsyncAutocompleteInput } from "../../utils/components/AsyncAutocompleteInput";
import { transform, styles as createStyles } from "./ReceiveCreate";

const useStyles = makeStyles({
  ...createStyles,
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
});

const ReceiveEdit: FC<EditProps> = (props) => {
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
      <ReceiveForm />
    </Edit>
  );
};

const ReceiveForm = (props: any) => {
  const classes = useStyles();
  const onFailure = useOnFailure();

  return (
    <FormWithRedirect
      {...props}
      render={(formProps: any) => (
        <Card>
          <form>
            <CardContent>
              <Box display={{ sm: "block", md: "flex" }}>
                <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
                  <Box display={{ sm: "block", md: "flex" }}>
                    <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
                      <TextInput
                        source="reference"
                        resource="receives"
                        fullWidth
                        validate={validateReference(props)}
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
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
                  <Box display={{ sm: "block", md: "flex" }}>
                    <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
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
                    <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
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
                <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
                  <DateInput
                    source="date"
                    resource="receives"
                    fullWidth
                    validate={requiredValidate}
                  />
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
                  <FormDataConsumer>
                    {({ formData }) => (
                      <Box
                        display={{ sm: "block", md: "flex" }}
                        // hide instead of null so that date is formatted properly
                        className={
                          formData && formData.status === "UPD"
                            ? classes.hiddenInput
                            : ""
                        }
                      >
                        <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
                          <DateInput
                            source="payment_date"
                            resource="receives"
                            fullWidth
                          />
                        </Box>
                        <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
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
                          formData && formData.status === "UPD"
                            ? classes.hiddenInput
                            : ""
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
                              source={getSource("product")}
                              getSource={getSource}
                              fullWidth
                              inputClassName={classes.lineItemReferenceInput}
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
              <Box display={{ sm: "block", md: "flex" }}>
                <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
                  <FormDataConsumer>
                    {(props) => (
                      <TotalInput
                        source="total_amount"
                        resource="receives"
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
                        resource="receives"
                        fullWidth
                        validate={validateNumber}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
                      <NumberInput
                        source="discount_amount"
                        resource="receives"
                        fullWidth
                        disabled
                      />
                    </Box>
                  </Box>
                  <NumberInput
                    source="net"
                    resource="receives"
                    fullWidth
                    validate={validateNumber}
                    disabled
                  />
                </Box>
                <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
                  <Box display={{ sm: "block", md: "flex" }}>
                    <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
                      <NumberInput
                        source="gst_rate"
                        resource="receives"
                        fullWidth
                        validate={validateNumber}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
                      <NumberInput
                        source="gst_amount"
                        resource="receives"
                        fullWidth
                        disabled
                      />
                    </Box>
                  </Box>
                  <NumberInput
                    source="grand_total"
                    resource="receives"
                    fullWidth
                    validate={validateNumber}
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
const validateNumber = [requiredValidate, number(), minValue(0)];
const validateReferenceUnicity = (props: any) =>
  validateUnicity({
    reference: "receives",
    source: "reference",
    record: props.record,
    message: "resources.receives.validation.reference_already_used",
  });
const validateReference = memoize((props: any) => [
  requiredValidate,
  validateReferenceUnicity(props),
]);

export default ReceiveEdit;
