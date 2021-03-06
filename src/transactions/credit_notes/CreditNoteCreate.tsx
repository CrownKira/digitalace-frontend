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
} from "react-admin";
import { Card } from "@material-ui/core";
import { useGetUserConfig } from "../../userMenu/configuration/useGetUserConfig";
import { AnyObject } from "react-final-form";
import { makeStyles } from "@material-ui/core/styles";

import { CreditNoteItem } from "../../types";
import { dateParser, validateUnicity, toFixedNumber } from "../../utils";
import { memoize } from "../../utils";
import { useOnFailure } from "../../utils/hooks";
import { FormTabWithoutLayout } from "../../utils/components/FormTabWithoutLayout";
import { LineItemsSection } from "../components/LineItemsSection";
import { DetailsTopSection } from "./sections/DetailsTopSection";
import { DetailsBottomSection } from "./sections/DetailsBottomSection";
import { useGetNextReference } from "../hooks/useGetNextReference";

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

export const CreditNoteCreate: FC<CreateProps> = (props) => {
  return (
    <Create {...props}>
      <CreditNoteForm />
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
  description: data.description || "",
});

export const getTotals = (
  formData: any
): {
  total_amount: number;
  discount_amount: number;
  net: number;
  gst_amount: number;
  grand_total: number;
  credits_used: number;
  credits_remaining: number;
} => {
  const lineItems = formData.creditnoteitem_set
    ? (formData.creditnoteitem_set as CreditNoteItem[]).map((lineItem) => {
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
  const total_amount = amounts.reduce((x: number, y: number) => x + y, 0);
  const discount_amount = total_amount * (discount_rate / 100);
  const net = total_amount * (1 - discount_rate / 100);
  const gst_amount = net * (gst_rate / 100);
  const grand_total = net * (1 + gst_rate / 100);
  const credits_used = toFixedNumber(formData.credits_used, 2);
  const refund = toFixedNumber(formData.refund, 2);
  const credits_remaining = grand_total - credits_used - refund;

  return {
    total_amount,
    discount_amount,
    net,
    gst_amount,
    grand_total,
    credits_used,
    credits_remaining,
  };
};

const CreditNoteForm = (props: any) => {
  const [totals, setTotals] = useState<Totals>({
    total_amount: 0,
    discount_amount: 0,
    net: 0,
    gst_amount: 0,
    grand_total: 0,
    credits_remaining: 0,
    credits_used: 0,
  });

  const updateTotals = (formData: any) => {
    // TODO: better way without passing formData?
    setTotals((totals) => ({ ...totals, ...getTotals(formData) }));
  };

  const onFailure = useOnFailure();

  const { reference, loading: loadingReference } = useGetNextReference({
    resource: "credit_notes",
    prefix: "CN",
  });
  const { loading: loadingUserConfig, data: userConfig } = useGetUserConfig();

  const postDefaultValue = () => ({
    reference,
    credit_note: null,
    date: new Date(),
    status: "DFT",
    total_amount: "0.00",
    discount_rate: userConfig?.discount_rate,
    discount_amount: "0.00",
    net: "0.00",
    gst_rate: userConfig?.gst_rate,
    gst_amount: "0.00",
    grand_total: "0.00",
    refund: "0.00",
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
          <TabbedFormView
            {...formProps}
            toolbar={
              <Toolbar
                // props from react-admin demo VisitorEdit
                resource="credit_notes"
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
            }
          >
            <FormTabWithoutLayout label="resources.credit_notes.tabs.details">
              <DetailsTopSection props={props} />
              <LineItemsSection
                source="creditnoteitem_set"
                resource="credit_note_items"
                label="resources.credit_notes.fields.creditnoteitem_set"
                updateTotals={updateTotals}
              />
              <DetailsBottomSection
                totals={totals}
                updateTotals={updateTotals}
              />
            </FormTabWithoutLayout>
          </TabbedFormView>
        );
      }}
    />
  );
};

export const requiredValidate = required();
export const validateNumber = [requiredValidate, number(), minValue(0)];
export const validateReferenceUnicity = (props: any) =>
  validateUnicity({
    reference: "credit_notes",
    source: "reference",
    record: props.record,
    message: "resources.credit_notes.validation.reference_already_used",
  });
export const validateReference = memoize((props: any) => [
  requiredValidate,
  validateReferenceUnicity(props),
]);

export interface Totals {
  total_amount: number;
  discount_amount: number;
  net: number;
  gst_amount: number;
  grand_total: number;
  credits_used: number;
  credits_remaining: number;
}
