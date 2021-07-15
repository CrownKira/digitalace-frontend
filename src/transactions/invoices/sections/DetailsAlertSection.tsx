import React, { FC } from "react";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import { useTranslate, useRedirect, Record } from "react-admin";

import { Totals } from "../InvoiceCreate";
import { ccyFormat } from "../../../utils";
import { Separator } from "../../../utils/components/Divider";

interface Props {
  record: Record;
  creditsAvailable: number;
  totals: Totals;
  applyCreditsIsOpen: boolean;
}

export const DetailsAlertSection: FC<Props> = ({
  record,
  creditsAvailable,
  totals,
  applyCreditsIsOpen,
}) => {
  const translate = useTranslate();
  const redirect = useRedirect();

  return (
    <div>
      {creditsAvailable > 0 && (
        <Alert
          severity="info"
          action={
            <Button
              color="inherit"
              size="small"
              // TODO: better way to redirect to other tab?
              onClick={() => {
                redirect(`/invoices/${record.id || "create"}/2`);
              }}
            >
              {translate("resources.invoices.action.apply_credits")}
            </Button>
          }
        >
          {translate("resources.invoices.fields.credits_available")}:{" "}
          <strong>{ccyFormat(creditsAvailable, true)}</strong>
        </Alert>
      )}
      <Separator />
      {totals.total_amount_to_credit > 0 && applyCreditsIsOpen && (
        <Alert severity="warning">
          {translate("resources.invoices.notification.amount_to_credit")}:{" "}
          <strong>{ccyFormat(totals.total_amount_to_credit, true)}</strong>
        </Alert>
      )}
    </div>
  );
};
