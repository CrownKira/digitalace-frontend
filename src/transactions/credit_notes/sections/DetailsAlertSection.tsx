import React, { FC } from "react";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import { useTranslate, useRedirect, useQueryWithStore } from "react-admin";

interface Props {
  formProps: any;
}

export const DetailsAlertSection: FC<Props> = ({ formProps }) => {
  const translate = useTranslate();
  const redirect = useRedirect();

  const { data, loaded } = useQueryWithStore({
    type: "getOne",
    resource: "invoices",
    payload: { id: formProps.record.created_from },
  });

  return (
    <div>
      {formProps.record.created_from && loaded && (
        <Alert
          severity="info"
          action={
            <Button
              color="inherit"
              size="small"
              // TODO: better way to redirect to other tab?
              onClick={() => {
                redirect(`invoices/${formProps.record.created_from}`);
              }}
            >
              {translate("resources.credit_notes.action.view")}
            </Button>
          }
        >
          {translate("resources.credit_notes.notification.created_from", {
            reference: data.reference,
          })}
        </Alert>
      )}
    </div>
  );
};
