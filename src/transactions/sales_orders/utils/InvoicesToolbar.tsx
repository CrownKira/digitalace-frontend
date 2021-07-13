import React, { FC } from "react";
import {
  TopToolbar,
  useRedirect,
  useTranslate,
  useMutation,
  Record,
} from "react-admin";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";

import { CreateInvoiceButton } from "./CreateInvoiceButton";

interface Props {
  record: Record;
}

export const InvoicesToolbar: FC<Props> = ({ record, ...rest }) => {
  const redirect = useRedirect();
  const translate = useTranslate();
  const [create, { loading, loaded, data }] = useMutation({
    type: "create",
    resource: "invoices",
    payload: {
      data: {
        sales_order: record.id,
        customer: record.customer,
        invoiceitem_set: record.salesorderitem_set,
        salesperson: record.salesperson,
      },
    },
  });

  return (
    <>
      {loaded && (
        <Alert
          severity="success"
          action={
            <Button
              color="inherit"
              size="small"
              // TODO: better way to redirect to other tab?
              onClick={() => {
                redirect(`invoices/${data.id}`);
              }}
            >
              {translate("resources.sales_orders.action.view")}
            </Button>
          }
        >
          {translate("resources.sales_orders.notification.created_invoice", {
            reference: data.reference,
          })}
        </Alert>
      )}
      <TopToolbar {...rest}>
        <CreateInvoiceButton create={create} loading={loading} />
      </TopToolbar>
    </>
  );
};
