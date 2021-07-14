import React, { FC, useState, useEffect } from "react";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import {
  useTranslate,
  useRedirect,
  Record,
  useDataProvider,
  useNotify,
} from "react-admin";

interface Props {
  record: Record;
}

export const DetailsAlertSection: FC<Props> = ({ record }) => {
  const translate = useTranslate();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [invoiceData, setInvoiceData] = useState<Record>({} as Record);

  useEffect(() => {
    if (record.created_from) {
      dataProvider
        .getOne("invoices", { id: record.created_from })
        .then((response) => {
          setInvoiceData(response.data);
        })
        .catch(() => {
          notify("resources.credit_notes.data_provider_error", "warning");
        });
    }
  }, [dataProvider, notify, record.created_from]);

  return (
    <div>
      {record.created_from && (
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
          <strong>{invoiceData && invoiceData.reference}</strong>
        </Alert>
      )}
    </div>
  );
};
