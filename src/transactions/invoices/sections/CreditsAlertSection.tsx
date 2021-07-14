import React, { useState } from "react";
import Alert from "@material-ui/lab/Alert";
import { useTranslate } from "react-admin";
import { Fade } from "@material-ui/core";

export const CreditsAlertSection = () => {
  const translate = useTranslate();
  const [isAlertOpen, setIsAlertOpen] = useState(true);

  // TODO: use translate
  return (
    <div>
      <Fade in={isAlertOpen}>
        <Alert
          severity="info"
          onClose={() => {
            setIsAlertOpen(false);
          }}
        >
          <strong>{translate("pos.notification.tip")}</strong> -{" "}
          {translate("resources.invoices.notification.select_customer_tip")}
        </Alert>
      </Fade>
    </div>
  );
};
