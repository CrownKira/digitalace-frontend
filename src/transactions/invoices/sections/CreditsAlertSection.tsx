import React from "react";
import Alert from "@material-ui/lab/Alert";

export const CreditsAlertSection = () => {
  return (
    <div>
      <Alert severity="info" onClose={() => {}}>
        <strong>Tip</strong> - Remember to select a customer first before
        applying credits.
      </Alert>
    </div>
  );
};
