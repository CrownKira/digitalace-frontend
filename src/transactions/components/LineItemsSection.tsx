import React, { FC, ReactElement, cloneElement } from "react";
import {
  NumberInput,
  TextInput,
  ArrayInput,
  FormDataConsumer,
} from "react-admin";
import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { requiredValidate, validateNumber } from "../invoices/InvoiceCreate";
import { LineItemsIterator } from "./LineItemsIterator";
import { ProductNameInput } from "./ProductNameInput";

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
}

export const LineItemsSection: FC<Props> = ({ source, resource, label }) => {
  const classes = useStyles();

  return (
    <ArrayInput
      source={source}
      resource={resource}
      label={false}
      validate={requiredValidate}
    >
      <LineItemsIterator resource={resource}>
        <FormDataConsumer
          formClassName={classes.leftFormGroup}
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
        <NumberInput
          source="quantity"
          // formClassName={classes.leftFormGroup}
          className={classes.lineItemInput}
          validate={validateNumber}
        />
        <TextInput
          source="unit"
          // formClassName={classes.leftFormGroup}
          className={classes.lineItemInput}
          disabled
        />
        <NumberInput
          source="unit_price"
          // formClassName={classes.leftFormGroup}
          className={classes.lineItemInput}
          validate={validateNumber}
        />
        <NumberInput
          source="amount"
          // formClassName={classes.rightFormGroup}
          className={classes.lineItemInput}
        />
      </LineItemsIterator>
    </ArrayInput>
  );
};
