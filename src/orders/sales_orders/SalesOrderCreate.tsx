import { FC } from "react";
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
  SelectInput,
  FormDataConsumer,
  Loading,
  useGetList,
  SaveButton,
  Record,
  number,
  minValue,
} from "react-admin";
import { Box, Card, CardContent, InputAdornment } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import RichTextInput from "ra-input-rich-text";
import useGetUserConfig from "../../userMenu/configuration/useGetUserConfig";

import { statuses } from "./data";
import ProductNameInput from "../../transactions/invoices/fields/ProductNameInput";
import AmountInput from "../transactions/invoices/AmountInput";
import TotalInput from "./TotalInput";
import { validateUnicity } from "../../utils";
import { memoize } from "../../utils";
import { useOnFailure } from "../../utils/hooks";
import { AsyncAutocompleteInput } from "../../utils/components/AsyncAutocompleteInput";
import { SalesOrder } from "../../types";
import { incrementReference, dateParser } from "../../utils";
import LineItemsIterator from "../transactions/invoices/LineItemsIterator";

export const styles = {
  leftFormGroup: { display: "inline-block", marginRight: "0.5em" },
  rightFormGroup: {
    display: "inline-block",
  },
  lineItemInput: { width: 150 },
  lineItemReferenceInput: { width: 300 },
  hiddenInput: {
    display: "none",
  },
};

const useStyles = makeStyles(styles);

const SalesOrderCreate: FC<CreateProps> = (props) => {
  return (
    <Create component="div" {...props}>
      <SalesOrderForm />
    </Create>
  );
};

// a fix for DateField parse not working
export const transform = (data: Record) => ({
  ...data,
  date: dateParser(data.date),
  payment_date: dateParser(data.payment_date),
});

const SalesOrderForm = (props: any) => {
  const classes = useStyles();
  const onFailure = useOnFailure();

  const {
    data: sales_orders,
    ids: salesOrderIds,
    loading: loadingSalesOrders,
  } = useGetList<SalesOrder>(
    "sales_orders",
    { page: 1, perPage: 1 },
    { field: "id", order: "DESC" },
    {}
  );
  const { loading: loadingUserConfig, data: userConfig } = useGetUserConfig();

  const postDefaultValue = () => ({
    reference:
      sales_orders &&
      salesOrderIds.length > 0 &&
      sales_orders[salesOrderIds[0]].reference
        ? incrementReference(sales_orders[salesOrderIds[0]].reference, "SO", 4)
        : "SO-0000",
    date: new Date(),
    invoice: null,
    // FIXME: default to null date instead
    payment_date: new Date(),
    status: "PD",
    total_amount: "0.00",
    discount_rate: userConfig?.discount_rate,
    discount_amount: "0.00",
    net: "0.00",
    gst_rate: userConfig?.gst_rate,
    gst_amount: "0.00",
    grand_total: "0.00",
  });

  return loadingSalesOrders || loadingUserConfig ? (
    <Loading />
  ) : (
    <FormWithRedirect
      {...props}
      initialValues={postDefaultValue}
      render={(formProps: any) => (
        <Card>
          <form>
            <CardContent>
              <Box display={{ sm: "block", md: "flex" }}>
                <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
                  <DateInput
                    source="date"
                    resource="sales_order"
                    fullWidth
                    validate={requiredValidate}
                  />

                  <Box display={{ sm: "block", md: "flex" }}>
                    <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
                      <AsyncAutocompleteInput
                        optionText="name"
                        optionValue="id"
                        source="customer"
                        resource="sales_order"
                        reference="customers"
                        validate={requiredValidate}
                        fullWidth
                        // helperText="Please select your customer"
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
                      <AsyncAutocompleteInput
                        optionText="name"
                        optionValue="id"
                        source="salesperson"
                        resource="sales_order"
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
                        resource="sales_order"
                        fullWidth
                        validate={validateReference(props)}
                      />
                    </Box>
                    <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
                      <AsyncAutocompleteInput
                        // TODO: edit button start adornment
                        // refer to ProductNameInput.tsx
                        optionText="reference"
                        optionValue="id"
                        source="sales_order"
                        resource="sales_order"
                        reference="sales_orders"
                        fullWidth
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
                              source={getSource("product")}
                              getSource={getSource}
                              fullWidth
                              inputClassName={classes.lineItemReferenceInput}
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
                        resource="sales_order"
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
                        resource="sales_order"
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
                        resource="sales_order"
                        fullWidth
                        disabled
                      />
                    </Box>
                  </Box>
                  <NumberInput
                    source="net"
                    resource="sales_order"
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
                        resource="sales_order"
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
                        resource="sales_order"
                        fullWidth
                        disabled
                      />
                    </Box>
                  </Box>
                  <NumberInput
                    source="grand_total"
                    resource="sales_order"
                    fullWidth
                    validate={validateNumber}
                    disabled
                  />
                </Box>
              </Box>
            </CardContent>
            <Toolbar
              // props from react-admin demo VisitorEdit
              resource="sales_orders"
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
const validateNumber = [requiredValidate, number(), minValue(0)];
const validateReferenceUnicity = (props: any) =>
  validateUnicity({
    reference: "sales_orders",
    source: "reference",
    record: props.record,
    message: "resources.sales_orders.validation.reference_already_used",
  });
const validateReference = memoize((props: any) => [
  requiredValidate,
  validateReferenceUnicity(props),
]);

export default SalesOrderCreate;
