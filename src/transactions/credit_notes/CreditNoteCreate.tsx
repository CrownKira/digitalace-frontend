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

import { CreditNote, CreditNoteItem } from "../../types";
import {
  incrementReference,
  dateParser,
  validateUnicity,
  toFixedNumber,
} from "../../utils";
import { memoize } from "../../utils";
import { useOnFailure } from "../../utils/hooks";
import { FormTabWithoutLayout } from "../../utils/components/FormTabWithoutLayout";
import { LineItemsSection } from "../components/LineItemsSection";
import { DetailsTopSection } from "./sections/DetailsTopSection";
import { DetailsBottomSection } from "./sections/DetailsBottomSection";

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

export const CreditNoteCreate: FC<CreateProps> = (props) => {
  return (
    <Create component="div" {...props}>
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
});

export const getTotals = (
  formData: any
): {
  total_amount: number;
  discount_amount: number;
  net: number;
  gst_amount: number;
  grand_total: number;
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

  return {
    total_amount,
    discount_amount,
    net,
    gst_amount,
    grand_total,
  };
};

const CreditNoteForm = (props: any) => {
  const [totals, setTotals] = useState<Totals>({
    total_amount: 0,
    discount_amount: 0,
    net: 0,
    gst_amount: 0,
    grand_total: 0,
  });

  const updateTotals = (formData: any) => {
    // TODO: better way without passing formData?
    setTotals((totals) => ({ ...totals, ...getTotals(formData) }));
  };

  const onFailure = useOnFailure();

  const {
    data: credit_notes,
    ids: credit_noteIds,
    loading: loadingCreditNotes,
  } = useGetList<CreditNote>(
    "credit_notes",
    { page: 1, perPage: 1 },
    { field: "id", order: "DESC" },
    {}
  );
  const { loading: loadingUserConfig, data: userConfig } = useGetUserConfig();

  const postDefaultValue = () => ({
    reference:
      credit_notes && credit_noteIds.length > 0
        ? incrementReference(
            credit_notes[credit_noteIds[0]].reference,
            "INV",
            4
          )
        : "INV-0000",
    credit_note: null,
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

  return loadingCreditNotes || loadingUserConfig ? (
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
}
