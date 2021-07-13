import React, { FC } from "react";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import {
  useTranslate,
  useRedirect,
  useQueryWithStore,
  Record,
} from "react-admin";

interface Props {
  record: Record;
}

export const DetailsAlertSection: FC<Props> = ({ record }) => {
  const translate = useTranslate();
  const redirect = useRedirect();

  const { data, loaded } = useQueryWithStore({
    type: "getOne",
    resource: "invoices",
    payload: { id: record.created_from },
  });

  return (
    <div>
      {record.created_from && loaded && (
        <Alert
          severity="info"
          action={
            <Button
              color="inherit"
              size="small"
              // TODO: better way to redirect to other tab?
              onClick={() => {
                redirect(`/invoices/${record.created_from}`);
              }}
            >
              {translate("resources.credit_notes.action.view")}
            </Button>
          }
        >
          {translate("resources.credit_notes.notification.created_from")}{" "}
          <strong>{data.reference}</strong>
        </Alert>
      )}
    </div>
  );
};
