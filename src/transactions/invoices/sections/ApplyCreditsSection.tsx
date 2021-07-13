import React, { FC, useState } from "react";
import {
  FormDataConsumer,
  ArrayInput,
  TextInput,
  DateInput,
  NumberInput,
} from "react-admin";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useFormState, useForm } from "react-final-form";

import { TotalCreditsSection } from "./TotalCreditsSection";
import { validateCredits } from "../InvoiceCreate";
import { LineItemsIterator } from "../../../utils/components/LineItemsIterator";
import { SectionTitle } from "../../../utils/components/Divider";
import { ccyFormat, toFixedNumber } from "../../../utils";
import { CreditsApplication } from "../../../types";
import { Totals } from "../InvoiceCreate";

const useStyles = makeStyles({
  leftFormGroup: { display: "inline-block", marginRight: "0.5em" },
  rightFormGroup: {
    display: "inline-block",
  },
  lineItemInput: { width: 200 },
  label: { padding: "1em" },
});

interface Props {
  open: boolean;
  setTotals: React.Dispatch<React.SetStateAction<Totals>>;
}

// TODO: move to dialog form
export const ApplyCreditsSection: FC<Props> = ({ open, setTotals }) => {
  const classes = useStyles();
  const form = useForm();
  const { values: formData } = useFormState();
  const [totalCredits, setTotalCredits] = useState({
    total_amount_to_credit: 0,
    balance_due: formData.balance_due,
  });

  const updateTotalCredits = (
    scopedFormData: any,
    getSource: (source: string) => string
  ) => {
    const total_amount_to_credit = formData.creditsapplication_set
      ? (formData.creditsapplication_set as CreditsApplication[])
          .map((lineItem) => toFixedNumber(lineItem.amount_to_credit, 2))
          .reduce((x: number, y: number) => x + y, 0)
      : 0;

    const balance_due =
      toFixedNumber(formData.balance_due, 2) - total_amount_to_credit;

    form.change(
      getSource("amount_to_credit"),
      ccyFormat(scopedFormData.amount_to_credit)
    );

    setTotals((totals) => ({
      ...totals,
      amount_to_credit: total_amount_to_credit,
    }));

    setTotalCredits({ total_amount_to_credit, balance_due });
  };

  return open ? (
    <>
      <SectionTitle
        label="resources.invoices.fieldGroups.apply_credits"
        options={{ reference: formData.reference }}
      />
      <ArrayInput
        // TODO: make this a table
        // TODO: better way instead of using a dummy source?
        source="creditsapplication_set"
        format={() => []}
        resource="credits_applications"
        label=""
      >
        <LineItemsIterator
          resource="credits_applications"
          disableAdd
          disableRemove
          labels={[
            "resources.credit_notes.fields.reference",
            "resources.credits_applications.fields.date",
            "resources.credit_notes.fields.grand_total",
            "resources.credit_notes.fields.credits_remaining",
            "resources.credits_applications.fields.amount_to_credit",
          ]}
          draggable={false}
        >
          <TextInput
            // TODO: use NumberField instead
            // TODO: add currency
            source="reference"
            className={classes.lineItemInput}
            disabled
          />
          <DateInput
            source="date"
            className={classes.lineItemInput}
            initialValue={new Date()}
            disabled
          />
          <NumberInput
            source="grand_total"
            className={classes.lineItemInput}
            disabled
          />
          <NumberInput
            source="credits_remaining"
            className={classes.lineItemInput}
            disabled
          />
          <FormDataConsumer>
            {({ scopedFormData, getSource }) =>
              getSource ? (
                <NumberInput
                  // FIXME: can't add default value
                  source={getSource("amount_to_credit")}
                  label=""
                  className={classes.lineItemInput}
                  validate={validateCredits(scopedFormData)}
                  onBlur={() => updateTotalCredits(scopedFormData, getSource)}
                />
              ) : null
            }
          </FormDataConsumer>
        </LineItemsIterator>
      </ArrayInput>
      <Box display={{ sm: "block", md: "flex" }}>
        <Box flex={3} mr={{ sm: 0, md: "0.5em" }}></Box>
        <Box flex={2} mr={{ sm: 0, md: "0.5em" }}>
          <TotalCreditsSection totalCredits={totalCredits} />
        </Box>
      </Box>
    </>
  ) : null;
};
