import React, { FC } from "react";
import {
  NumberInput,
  TextInput,
  ArrayInput,
  FormDataConsumer,
} from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-final-form";

import { requiredValidate, validateNumber } from "../invoices/InvoiceCreate";
import { LineItemsIterator } from "../../utils/components/LineItemsIterator";
import { ccyFormat, toFixedNumber } from "../../utils";
import { AsyncAutocompleteInput } from "../../utils/components/AsyncAutocompleteInput";

const useStyles = makeStyles({
  leftFormGroup: { display: "inline-block", marginRight: "0.5em" },
  rightFormGroup: {
    display: "inline-block",
  },
  lineItemInput: { width: 150 },
  lineItemReferenceInput: { width: 300 },
});

interface Props {
  source: string;
  resource: string;
  label: string;
  updateTotals: (formData: any) => void;
}

export const LineItemsSection: FC<Props> = ({
  source,
  resource,
  updateTotals,
}) => {
  const classes = useStyles();
  const form = useForm();

  const handleOnBlur = (
    formData: any,
    scopedFormData: any,
    getSource: (source: string) => string
  ) => {
    const quantity = toFixedNumber(scopedFormData?.quantity, 0);
    const unit_price = toFixedNumber(scopedFormData?.unit_price, 2);
    const amount = quantity * unit_price;

    form.change(getSource("quantity"), quantity);
    form.change(getSource("unit_price"), ccyFormat(unit_price));
    form.change(getSource("amount"), ccyFormat(amount));
    updateTotals(formData);
  };

  return (
    <ArrayInput
      source={source}
      resource={resource}
      label=""
      validate={requiredValidate}
    >
      <LineItemsIterator resource={resource}>
        <FormDataConsumer label="resources.invoice_items.fields.product">
          {({ getSource }) =>
            getSource ? (
              <AsyncAutocompleteInput
                validate={requiredValidate}
                optionText="name"
                optionValue="id"
                reference="products"
                className={classes.lineItemReferenceInput}
                // TODO: more generic label?
                label={false}
                source={getSource("product")}
                fullWidth
                showSuggestions={false}
                onChange={(event, newValue) => {
                  if (newValue) {
                    form.batch(() => {
                      form.change(getSource("unit"), newValue.unit);
                      form.change(getSource("unit_price"), newValue.unit_price);
                      form.change(getSource("quantity"), "0");
                      form.change(getSource("amount"), "0.00");
                    });
                  }
                }}
              />
            ) : null
          }
        </FormDataConsumer>
        <FormDataConsumer label="resources.invoice_items.fields.quantity">
          {({ formData, scopedFormData, getSource }) => {
            if (getSource)
              return getSource ? (
                <NumberInput
                  source={getSource("quantity")}
                  className={classes.lineItemInput}
                  validate={validateNumber}
                  onBlur={() =>
                    handleOnBlur(formData, scopedFormData, getSource)
                  }
                  label=""
                />
              ) : null;
          }}
        </FormDataConsumer>
        <TextInput source="unit" className={classes.lineItemInput} disabled />
        <FormDataConsumer label="resources.invoice_items.fields.unit_price">
          {({ formData, scopedFormData, getSource }) =>
            getSource ? (
              <NumberInput
                source={getSource("unit_price")}
                className={classes.lineItemInput}
                validate={validateNumber}
                onBlur={() => handleOnBlur(formData, scopedFormData, getSource)}
                label=""
              />
            ) : null
          }
        </FormDataConsumer>
        <NumberInput
          source="amount"
          className={classes.lineItemInput}
          disabled
        />
      </LineItemsIterator>
    </ArrayInput>
  );
};
