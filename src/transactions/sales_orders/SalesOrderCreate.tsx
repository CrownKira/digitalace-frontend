import React, { FC, useState } from "react";
import {
  Create,
  CreateProps,
  Toolbar,
  FormWithRedirect,
  required,
  Loading,
  useGetList,
  SaveButton,
  Record,
  TabbedFormView,
  number,
  minValue,
} from "react-admin";
import { Card, CardContent } from "@material-ui/core";
import { useGetUserConfig } from "../../userMenu/configuration/useGetUserConfig";
import { withStyles } from "@material-ui/core/styles";
import { AnyObject } from "react-final-form";
import { makeStyles } from "@material-ui/core/styles";

import { SalesOrder } from "../../types";
import { incrementReference, dateParser, validateUnicity } from "../../utils";
import { memoize } from "../../utils";
import { useOnFailure } from "../../utils/hooks";
import { FormTabWithCustomLayout } from "../../utils/components/FormTabWithCustomLayout";
import { LineItemsSection } from "../components/LineItemsSection";
import { DetailTopSection } from "./sections/DetailTopSection";
import { DetailBottomSection } from "./sections/DetailBottomSection";
import { ProductNameInput } from "../components/ProductNameInput";

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
  label: {
    padding: "1em",
  },
};

const useStyles = makeStyles(styles);

// TODO: move to utils
export const Wrapper = withStyles(() => ({
  root: {
    padding: 0,
    "&:last-child": {
      paddingBottom: 0,
    },
  },
}))(CardContent);

export const SalesOrderCreate: FC<CreateProps> = (props) => {
  return (
    <Create component="div" {...props}>
      <SalesOrderForm />
    </Create>
  );
};

// eslint-disable-next-line no-empty-pattern
export const validateForm = ({}: AnyObject) => {
  const errors = {} as any;

  return errors;
};

// a fix for DateField parse not working
export const transform = (data: Record) => ({
  ...data,
  date: dateParser(data.date),
});

const SalesOrderForm = (props: any) => {
  const classes = useStyles();
  const [state, setState] = useState({
    // TODO: make use of formProps instead?
  });

  const onFailure = useOnFailure();

  const {
    data: sales_orders,
    ids: sales_orderIds,
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
      sales_orders && sales_orderIds.length > 0
        ? incrementReference(sales_orders[sales_orderIds[0]].reference, "SO", 4)
        : "SO-0000",
    sales_order: null,
    date: new Date(),
    status: "UPD",
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
      initialValues={postDefaultValue}
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
                    resource="sales_orders"
                    record={formProps.record}
                    basePath={formProps.basePath}
                    invalid={formProps.invalid}
                    handleSubmit={formProps.handleSubmit}
                    saving={formProps.saving}
                    pristine={formProps.pristine}
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
                <FormTabWithCustomLayout label="resources.sales_orders.tabs.details">
                  <DetailTopSection
                    props={props}
                    state={state}
                    setState={setState}
                  />
                  <LineItemsSection
                    source="salesorderitem_set"
                    resource="sales_order_items"
                    label="resources.sales_orders.fields.salesorderitem_set"
                  />
                  <DetailBottomSection formProps={formProps} />
                </FormTabWithCustomLayout>
              </TabbedFormView>
            </Wrapper>
          </Card>
        );
      }}
    />
  );
};

export const requiredValidate = required();
export const validateNumber = [requiredValidate, number(), minValue(0)];
export const validateReferenceUnicity = (props: any) =>
  validateUnicity({
    reference: "sales_orders",
    source: "reference",
    record: props.record,
    message: "resources.sales_orders.validation.reference_already_used",
  });
export const validateReference = memoize((props: any) => [
  requiredValidate,
  validateReferenceUnicity(props),
]);
