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
  productInput: ReactElement;
}

export const LineItemsSection: FC<Props> = ({
  source,
  resource,
  label,
  productInput,
}) => {
  const classes = useStyles();

  return (
    <Card>
      <CardContent>
        <ArrayInput
          source={source}
          resource={resource}
          label={label}
          validate={requiredValidate}
        >
          <LineItemsIterator resource={resource}>
            <FormDataConsumer
              formClassName={classes.leftFormGroup}
              validate={requiredValidate}
            >
              {({ getSource, ...rest }) =>
                getSource
                  ? cloneElement(productInput, {
                      source: getSource("product"),
                      getSource,
                      ...rest,
                    })
                  : null
              }
            </FormDataConsumer>
            <NumberInput
              source="quantity"
              formClassName={classes.leftFormGroup}
              className={classes.lineItemInput}
              validate={validateNumber}
            />
            <TextInput
              source="unit"
              formClassName={classes.leftFormGroup}
              className={classes.lineItemInput}
              disabled
            />
            <NumberInput
              source="unit_price"
              formClassName={classes.leftFormGroup}
              className={classes.lineItemInput}
              validate={validateNumber}
            />
            <NumberInput
              source="amount"
              formClassName={classes.rightFormGroup}
              className={classes.lineItemInput}
            />
          </LineItemsIterator>
        </ArrayInput>
      </CardContent>
    </Card>
  );
};
