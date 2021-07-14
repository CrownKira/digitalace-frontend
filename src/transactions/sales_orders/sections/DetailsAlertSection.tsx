import React, { FC } from "react";
import { Button } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useTranslate, Record, useRedirect } from "react-admin";

interface Props {
  record: Record;
}

export const DetailsAlertSection: FC<Props> = ({ record }) => {
  const translate = useTranslate();
  const redirect = useRedirect();

  return (
    <div>
      {record.invoice_set?.length === 0 && (
        <Alert
          severity="info"
          action={
            <Button
              color="inherit"
              size="small"
              // TODO: better way to redirect to other tab?
              onClick={() => {
                redirect(`/sales_orders/${record.id}/1`);
              }}
            >
              {translate("resources.sales_orders.action.convert_to_invoice")}
            </Button>
          }
        >
          <strong>{translate("pos.notification.tip")}</strong> -{" "}
          {translate("resources.sales_orders.notification.fulfill_order_tip")}
        </Alert>
      )}
    </div>
  );
};
