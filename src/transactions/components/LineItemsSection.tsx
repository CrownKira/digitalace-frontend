import React, { FC, ReactElement, cloneElement } from "react";
import {
  NumberInput,
  TextInput,
  ArrayInput,
  FormDataConsumer,
} from "react-admin";
import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-final-form";

import { requiredValidate, validateNumber } from "../invoices/InvoiceCreate";
import { LineItemsIterator } from "../../utils/components/LineItemsIterator";
import { ProductNameInput } from "./ProductNameInput";
import { ccyFormat, toFixedNumber } from "../../utils";

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
  label,
  updateTotals,
}) => {
  const classes = useStyles();
  const form = useForm();
  // const amount = useField('')

  const handleOnBlur = (
    formData: any,
    scopedFormData: any,
    getSource: (source: string) => string
  ) => {
    const quantity = toFixedNumber(scopedFormData.quantity, 0);
    const unit_price = toFixedNumber(scopedFormData.unit_price, 2);
    const amount = quantity * unit_price;
    // const amountChange = amount - Number(scopedFormData.amount);

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
      <LineItemsIterator
        resource={resource}

        // draggable={false}
      >
        <FormDataConsumer
          validate={requiredValidate}
          label="resources.invoice_items.fields.product"
        >
          {({ getSource }) =>
            getSource ? (
              <ProductNameInput
                source={getSource("product")}
                getSource={getSource}
                fullWidth
                inputClassName={classes.lineItemReferenceInput}
                // FIXME: showSuggestions not working
                showSuggestions={false}
                // {...rest}
              />
            ) : null
          }
        </FormDataConsumer>
        <FormDataConsumer
          validate={requiredValidate}
          label="resources.invoice_items.fields.quantity"
        >
          {({ formData, scopedFormData, getSource }) =>
            getSource ? (
              <NumberInput
                source={getSource("quantity")}
                className={classes.lineItemInput}
                validate={validateNumber}
                onBlur={() => handleOnBlur(formData, scopedFormData, getSource)}
                label=""
              />
            ) : null
          }
        </FormDataConsumer>
        <TextInput source="unit" className={classes.lineItemInput} disabled />
        <FormDataConsumer
          validate={requiredValidate}
          label="resources.invoice_items.fields.unit_price"
        >
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

/*
        <FormDataConsumer
          
          validate={requiredValidate}
          label="resources.invoice_items.fields.product"
        >
          {({ getSource, ...rest }) =>
            getSource ? (
              <ProductNameInput
                source={getSource("product")}
                getSource={getSource}
                fullWidth
                inputClassName={classes.lineItemReferenceInput}
                showSuggestions={false}
                {...rest}
              />
            ) : null
          }
        </FormDataConsumer>
*/
