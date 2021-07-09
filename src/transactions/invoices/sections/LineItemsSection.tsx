import {
  NumberInput,
  TextInput,
  ArrayInput,
  FormDataConsumer,
} from "react-admin";
import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import {
  requiredValidate,
  validateNumber,
  styles as createStyles,
} from "../InvoiceCreate";
import { ProductNameInput } from "../fields/ProductNameInput";
import { LineItemsIterator } from "../utils/LineItemsIterator";

const useStyles = makeStyles({
  ...createStyles,
});

export const LineItemsSection = () => {
  const classes = useStyles();

  return (
    <Card>
      <CardContent>
        <ArrayInput
          source="invoiceitem_set"
          resource="invoice_items"
          label="resources.invoices.fields.invoiceitem_set"
          validate={requiredValidate}
        >
          <LineItemsIterator resource="invoice_items">
            <FormDataConsumer
              formClassName={classes.leftFormGroup}
              validate={requiredValidate}
            >
              {({ getSource, ...rest }) =>
                getSource ? (
                  <ProductNameInput
                    source={getSource("product")}
                    getSource={getSource}
                    fullWidth
                    inputClassName={classes.lineItemReferenceInput}
                    {...rest}
                  />
                ) : null
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
