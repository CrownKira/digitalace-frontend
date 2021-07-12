import React, { FC } from "react";
import {
  FormDataConsumer,
  ArrayInput,
  TextInput,
  DateInput,
  NumberInput,
} from "react-admin";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { TotalCreditsSection } from "./TotalCreditsSection";
import { validateCredits } from "../InvoiceCreate";
import { LineItemsIterator } from "../../../utils/components/LineItemsIterator";

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
  // console.log("apply credits");

  return open ? (
    <>
      <ArrayInput
        // TODO: make this a table
        source="fake_creditsapplication_set"
        resource="credits_applications"
        label=""
        // record={undefined}
      >
        <LineItemsIterator
          resource="credits_applications"
          // record={undefined}
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
            // TODO: use NumberField instead
            // TODO: add currency
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
                />
              ) : null
            }
          </FormDataConsumer>
        </LineItemsIterator>
      </ArrayInput>
      <Box display={{ sm: "block", md: "flex" }}>
        <Box flex={3} mr={{ sm: 0, md: "0.5em" }}></Box>
        <Box flex={2} mr={{ sm: 0, md: "0.5em" }}>
          <TotalCreditsSection />
        </Box>
      </Box>
    </>
  ) : null;
};
