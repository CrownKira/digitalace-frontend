import { FC } from "react";
import {
  FormDataConsumer,
  ArrayInput,
  SimpleFormIterator,
  TextInput,
  DateInput,
  NumberInput,
} from "react-admin";
import { Card, CardContent, Box, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { TotalCreditsSection } from "./TotalCreditsSection";
import { validateCredits } from "../InvoiceCreate";

const useStyles = makeStyles({
  leftFormGroup: { display: "inline-block", marginRight: "0.5em" },
  rightFormGroup: {
    display: "inline-block",
  },
  lineItemInput: { width: 200 },
  label: { padding: "1em" },
});

interface Props {
  formProps: any;
  open: boolean;
}

export const ApplyCreditsSection: FC<Props> = ({ formProps, open }) => {
  const classes = useStyles();

  return open ? (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="flex-end">
          <FormDataConsumer>
            {({ formData }) => (
              <span className={classes.label}>
                Invoice Balance:{" "}
                {Number(formData.balance_due).toLocaleString(undefined, {
                  style: "currency",
                  currency: "SGD",
                })}
              </span>
            )}
          </FormDataConsumer>
        </Box>
        <Divider />
        <ArrayInput
          // TODO: make this a table
          source="fake_creditsapplication_set"
          resource="credits_applications"
          label="resources.invoices.fields.creditsapplication_set"
          record={undefined}
        >
          <SimpleFormIterator
            resource="credits_applications"
            record={undefined}
            disableAdd
            disableRemove
          >
            <TextInput
              // TODO: use NumberField instead
              // TODO: add currency
              source="reference"
              label="resources.credit_notes.fields.reference"
              formClassName={classes.leftFormGroup}
              className={classes.lineItemInput}
              disabled
            />
            <DateInput
              source="date"
              formClassName={classes.leftFormGroup}
              className={classes.lineItemInput}
              initialValue={new Date()}
              disabled
            />
            <NumberInput
              // TODO: use NumberField instead
              // TODO: add currency
              source="grand_total"
              label="resources.credit_notes.fields.grand_total"
              formClassName={classes.leftFormGroup}
              className={classes.lineItemInput}
              disabled
            />
            <NumberInput
              source="credits_remaining"
              label="resources.credit_notes.fields.credits_remaining"
              formClassName={classes.leftFormGroup}
              className={classes.lineItemInput}
              disabled
            />
            <FormDataConsumer formClassName={classes.rightFormGroup}>
              {({ scopedFormData, getSource }) =>
                getSource ? (
                  <NumberInput
                    // FIXME: can't add default value
                    source={getSource("amount_to_credit")}
                    label="resources.credits_applications.fields.amount_to_credit"
                    className={classes.lineItemInput}
                    validate={validateCredits(scopedFormData)}
                  />
                ) : null
              }
            </FormDataConsumer>
          </SimpleFormIterator>
        </ArrayInput>
        <Divider />
        <FormDataConsumer>
          {({ formData }) => (
            <TotalCreditsSection
              formData={formData}
              record={formProps.record}
            />
          )}
        </FormDataConsumer>
      </CardContent>
    </Card>
  ) : null;
};
