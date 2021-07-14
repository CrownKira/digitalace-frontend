import React, { FC, useState } from "react";
import {
  Create,
  CreateProps,
  Toolbar,
  FormWithRedirect,
  required,
  Loading,
  SaveButton,
  Record,
  TabbedFormView,
  number,
  minValue,
  maxValue,
  TopToolbar,
} from "react-admin";
import { Card, CardContent } from "@material-ui/core";
import { useGetUserConfig } from "../../userMenu/configuration/useGetUserConfig";
import { withStyles } from "@material-ui/core/styles";
import { AnyObject } from "react-final-form";
import { makeStyles } from "@material-ui/core/styles";

import { CreditsApplication, InvoiceItem } from "../../types";
import { dateParser, validateUnicity, toFixedNumber } from "../../utils";
import { memoize } from "../../utils";
import { useOnFailure } from "../../utils/hooks";
import { FormTabWithoutLayout } from "../../utils/components/FormTabWithoutLayout";
import { ApplyCreditsButton } from "./utils/ApplyCreditsButton";
import { ApplyCreditsSection } from "./sections/ApplyCreditsSection";
import { LineItemsSection } from "../components/LineItemsSection";
import { DetailsTopSection } from "./sections/DetailsTopSection";
import { DetailsBottomSection } from "./sections/DetailsBottomSection";
import { PaymentSection } from "./sections/PaymentSection";
import { DetailsAlertSection } from "./sections/DetailsAlertSection";
import { CreditsAlertSection } from "./sections/CreditsAlertSection";
import { Separator } from "../../utils/components/Divider";
import { useGetIncrementedReference } from "../hooks/useGetIncrementedReference";

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

// eslint-disable-next-line no-empty-pattern
export const validateForm = ({}: AnyObject): any => {
  const errors = {} as any;

  return errors;
};

// a fix for DateField parse not working
// export const transform = ({
//   creditsapplication_set,
//   ...data
// }: Record): Record => ({
//   ...data,
//   date: dateParser(data.date),
//   payment_date: dateParser(data.payment_date),
//   creditsapplication_set: creditsapplication_set, // TODO: better way to not pre-fill but send data?
// });

export const getTotals = (
  formData: any
): {
  total_amount: number;
  discount_amount: number;
  net: number;
  gst_amount: number;
  grand_total: number;
  balance_due: number;
  credits_applied: number;
} => {
  const lineItems = formData.invoiceitem_set
    ? (formData.invoiceitem_set as InvoiceItem[]).map((lineItem) => {
        const quantity = lineItem ? toFixedNumber(lineItem.quantity, 0) : 0;

        const unitPrice = lineItem ? toFixedNumber(lineItem.unit_price, 2) : 0;

        const amount = quantity * unitPrice;

        return {
          quantity,
          unit_price: unitPrice,
          amount,
        };
      })
    : [];
  const amounts = lineItems.map((lineItem) => lineItem.amount);
  const discount_rate = toFixedNumber(formData.discount_rate, 2);
  const gst_rate = toFixedNumber(formData.gst_rate, 2);
  const credits_applied = toFixedNumber(formData.credits_applied, 2);
  const total_amount = amounts.reduce((x: number, y: number) => x + y, 0);
  const discount_amount = total_amount * (discount_rate / 100);
  const net = total_amount * (1 - discount_rate / 100);
  const gst_amount = net * (gst_rate / 100);
  const grand_total = net * (1 + gst_rate / 100);
  const balance_due = grand_total - credits_applied;

  return {
    total_amount,
    discount_amount,
    net,
    gst_amount,
    grand_total,
    balance_due,
    credits_applied,
  };
};

export const getCreditsTotals = (formData: any, totals: Totals) => {
  const total_amount_to_credit = formData.creditsapplication_set
    ? (formData.creditsapplication_set as CreditsApplication[])
        .map((lineItem) => toFixedNumber(lineItem.amount_to_credit, 2))
        .reduce((x: number, y: number) => x + y, 0)
    : 0;

  const balance_due2 =
    toFixedNumber(totals.balance_due, 2) - total_amount_to_credit;

  return {
    total_amount_to_credit,
    balance_due2,
  };
};

const InvoiceForm = (props: any) => {
  const { status } = props.record;
  const [isPaid, setIsPaid] = useState(status === "PD");
  const [IsApplyCreditsOpen, setApplyCreditsOpen] = useState(false);
  const [IsCreditsAvailable, setIsCreditsAvailable] = useState(0);
  // TODO: use context
  const [totals, setTotals] = useState<Totals>({
    total_amount: 0,
    discount_amount: 0,
    net: 0,
    gst_amount: 0,
    grand_total: 0,
    balance_due: 0,
    credits_applied: 0,
    total_amount_to_credit: 0,
    balance_due2: 0,
  });

  const { reference, loading: loadingReference } = useGetIncrementedReference({
    resource: "invoices",
    prefix: "INV",
  });
  const { loading: loadingUserConfig, data: userConfig } = useGetUserConfig();

  const transform = (data: Record): Record => ({
    ...data,
    date: dateParser(data.date),
    payment_date: dateParser(data.payment_date),
    ...(!IsApplyCreditsOpen && { creditsapplication_set: [] }),
  });

  const updateTotals = (formData: any) => {
    // formData needed since this function is not within <Form>
    setTotals((totals) => ({ ...totals, ...getTotals(formData) }));
    updateCreditsTotals(formData);
  };

  const updateCreditsTotals = (formData: any) => {
    setTotals((totals) => ({
      ...totals,
      ...getCreditsTotals(formData, totals),
    }));
  };
  const onFailure = useOnFailure();

  const postDefaultValue = () => ({
    reference,
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
    creditsapplication_set: [],
  });

  return loadingReference || loadingUserConfig ? (
    <Loading />
  ) : (
    <FormWithRedirect
      warnWhenUnsavedChanges
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
                <FormTabWithoutLayout label="resources.invoices.tabs.details">
                  <DetailsAlertSection
                    record={formProps.record}
                    IsCreditsAvailable={IsCreditsAvailable}
                    totals={totals}
                    IsApplyCreditsOpen={IsApplyCreditsOpen}
                  />
                  <Separator />
                  <DetailsTopSection
                    props={props}
                    isPaid={isPaid}
                    setIsPaid={setIsPaid}
                    IsApplyCreditsOpen={IsApplyCreditsOpen}
                    setApplyCreditsOpen={setApplyCreditsOpen}
                    setIsCreditsAvailable={setIsCreditsAvailable}
                  />
                  <LineItemsSection
                    source="invoiceitem_set"
                    resource="invoice_items"
                    label="resources.invoices.fields.invoiceitem_set"
                    updateTotals={updateTotals}
                  />
                  <DetailsBottomSection
                    totals={totals}
                    updateTotals={updateTotals}
                  />
                </FormTabWithoutLayout>
                {isPaid ? (
                  <FormTabWithoutLayout
                    /**
                     * TODO: hide tab when unpaid
                     * for some reason, this tab cannot be toggled using
                     * formProps?.form?.getFieldState('status')?.value === 'UPD' ? null : (...)
                     */
                    label="resources.invoices.tabs.record_payment"
                  >
                    <PaymentSection />
                  </FormTabWithoutLayout>
                ) : null}
                <FormTabWithoutLayout label="resources.invoices.tabs.credits_applied">
                  <CreditsAlertSection />
                  <TopToolbar>
                    <ApplyCreditsButton
                      onClick={() => {
                        setApplyCreditsOpen(true);
                      }}
                      disabled={IsApplyCreditsOpen}
                    />
                  </TopToolbar>
                  <Separator />
                  <ApplyCreditsSection
                    isOpen={IsApplyCreditsOpen}
                    totals={totals}
                    updateCreditsTotals={updateCreditsTotals}
                    record={formProps.record}
                  />
                </FormTabWithoutLayout>
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

export interface Totals {
  total_amount: number;
  discount_amount: number;
  net: number;
  gst_amount: number;
  grand_total: number;
  balance_due: number;
  credits_applied: number;
  total_amount_to_credit: number;
  balance_due2: number;
}
