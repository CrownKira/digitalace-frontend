import React, { FC, useRef } from "react";
import {
  NumberInput,
  TextInput,
  ArrayInput,
  FormDataConsumer,
  Record,
} from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-final-form";

import { requiredValidate, validateNumber } from "../../invoices/InvoiceCreate";
import { TableFormIterator } from "../../../utils/components/TableFormIterator";
import { AsyncAutocompleteInput } from "../../../utils/components/AsyncAutocompleteInput";

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

export const LineItemsSection: FC<Props> = ({ source, resource }) => {
  const classes = useStyles();
  const form = useForm();
  const cache = useRef(new Map<number, Record>());

  return (
    <ArrayInput
      source={source}
      resource={resource}
      label=""
      validate={requiredValidate}
    >
      <TableFormIterator resource={resource}>
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
                cache={cache.current}
                onChange={(event, newValue) => {
                  if (newValue) {
                    form.batch(() => {
                      form.change(getSource("unit"), newValue.unit);
                      form.change(getSource("quantity"), "0");
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
                  label=""
                />
              ) : null;
          }}
        </FormDataConsumer>
        <TextInput source="unit" className={classes.lineItemInput} disabled />
      </TableFormIterator>
    </ArrayInput>
  );
};
