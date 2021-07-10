import React, { FC, useState } from "react";
import {
  Create,
  CreateProps,
  Toolbar,
  FormWithRedirect,
  required,
  FormDataConsumer,
  Loading,
  useGetList,
  SaveButton,
  Record,
  TabbedFormView,
  number,
  minValue,
  maxValue,
} from "react-admin";
import { Card, CardContent } from "@material-ui/core";
import { useGetUserConfig } from "../../userMenu/configuration/useGetUserConfig";
import { withStyles } from "@material-ui/core/styles";
import { AnyObject } from "react-final-form";
import { makeStyles } from "@material-ui/core/styles";

import { Invoice } from "../../types";
import { incrementReference, dateParser, validateUnicity } from "../../utils";
import { memoize } from "../../utils";
import { useOnFailure } from "../../utils/hooks";
import { FormTabWithCustomLayout } from "../../utils/components/FormTabWithCustomLayout";
import { CreditsApplicationListActions } from "./utils/CreditsApplicationListActions";
import { ApplyCreditsSection } from "./sections/ApplyCreditsSection";
import { LineItemsSection } from "../components/LineItemsSection";
import { DetailTopSection } from "./sections/DetailTopSection";
import { DetailBottomSection } from "./sections/DetailBottomSection";
import { PaymentSection } from "./sections/PaymentSection";
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

export const InvoiceCreate: FC<CreateProps> = (props) => {
  return (
    <Create component="div" {...props}>
      <InvoiceForm />
    </Create>
  );
};

export const validateForm = ({ credits_applied, grand_total }: AnyObject) => {
  const errors = {} as any;

  if (Number(credits_applied) > Number(grand_total)) {
    errors.credits_applied = ["resources.invoices.validation.invalid_credits"];
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
    isPaid: props?.record?.status === "PD",
    openApplyCredits: false,
  });

  const onFailure = useOnFailure();

  const {
    data: invoices,
    ids: invoiceIds,
    loading: loadingInvoices,
  } = useGetList<Invoice>(
    "invoices",
    { page: 1, perPage: 1 },
    { field: "id", order: "DESC" },
    {}
  );
  const { loading: loadingUserConfig, data: userConfig } = useGetUserConfig();

  const postDefaultValue = () => ({
    reference:
      invoices && invoiceIds.length > 0
        ? incrementReference(invoices[invoiceIds[0]].reference, "INV", 4)
        : "INV-0000",
    sales_order: null,
    date: new Date(),
    // FIXME: default to null date instead
    payment_date: new Date(),
    status: "UPD",
    total_amount: "0.00",
    discount_rate: userConfig?.discount_rate,
    discount_amount: "0.00",
    net: "0.00",
    gst_rate: userConfig?.gst_rate,
    gst_amount: "0.00",
    grand_total: "0.00",
    credits_available: "0.00",
    credits_applied: "0.00",
    balance_due: "0.00",
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
                <FormTabWithCustomLayout label="resources.invoices.tabs.details">
                  <DetailTopSection
                    props={props}
                    state={state}
                    setState={setState}
                  />
                  <LineItemsSection
                    source="invoiceitem_set"
                    resource="invoice_items"
                    label="resources.invoices.fields.invoiceitem_set"
                  />
                  <DetailBottomSection formProps={formProps} />
                </FormTabWithCustomLayout>
                {state.isPaid ? (
                  <FormTabWithCustomLayout
                    /**
                     * TODO: hide tab when unpaid
                     * for some reason, this tab cannot be toggled using
                     * formProps?.form?.getFieldState('status')?.value === 'UPD' ? null : (...)
                     */
                    label="resources.invoices.tabs.record_payment"
                  >
                    <PaymentSection />
                  </FormTabWithCustomLayout>
                ) : null}
                <FormTabWithCustomLayout label="resources.invoices.tabs.credits_applied">
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
                  <ApplyCreditsSection
                    formProps={formProps}
                    open={state.openApplyCredits}
                  />
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
    reference: "invoices",
    source: "reference",
    record: props.record,
    message: "resources.invoices.validation.reference_already_used",
  });
export const validateReference = memoize((props: any) => [
  requiredValidate,
  validateReferenceUnicity(props),
]);
export const validateCredits = (scopedFormData: any) => [
  number(),
  minValue(0),
  maxValue(Number(scopedFormData?.credits_remaining)),
];
