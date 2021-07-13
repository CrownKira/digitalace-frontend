import React from "react";
import Alert from "@material-ui/lab/Alert";
import { useTranslate } from "react-admin";

export const CreditsAlertSection = () => {
  const translate = useTranslate();
  // TODO: use translate
  return (
    <div>
      <Alert severity="info" onClose={() => {}}>
        <strong>{translate("pos.notification.tip")}</strong> -{" "}
        {translate("resources.invoices.notification.select_customer_tip")}
      </Alert>
    </div>
  );
};
