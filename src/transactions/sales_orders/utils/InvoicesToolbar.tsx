import React, { FC, useEffect } from "react";
import {
  TopToolbar,
  useRedirect,
  useTranslate,
  useMutation,
  Record,
  useNotify,
  Link,
} from "react-admin";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";

import { CreateInvoiceButton } from "./CreateInvoiceButton";
import { dateFormatter, getErrorMessage } from "../../../utils";
import { useGetIncrementedReference } from "../../hooks/useGetIncrementedReference";

interface Props {
  record: Record;
}

export const InvoicesToolbar: FC<Props> = ({ record, ...rest }) => {
  const redirect = useRedirect();
  const translate = useTranslate();
  const notify = useNotify();
  const { reference, loading: loadingReference } = useGetIncrementedReference({
    resource: "invoices",
    prefix: "INV",
  });
  const [mutate, { loading, loaded, data, error }] = useMutation();

  const create = () => {
    // TODO: better way?
    // must ensure that reference is ready when this function is called
    return mutate({
      type: "create",
      resource: "invoices",
      payload: {
        data: {
          reference,
          sales_order: record.id,
          customer: record.customer,
          invoiceitem_set: record.salesorderitem_set,
          salesperson: record.salesperson,
          date: dateFormatter(new Date()),
          gst_rate: record.gst_rate,
          discount_rate: record.discount_rate,
          refund: 0,
        },
      },
    });
  };

  useEffect(() => {
    if (error) {
      notify(getErrorMessage(error), "warning");
    }
  }, [error, notify]);

  return (
    <>
      {loaded && (
        <Alert severity="success" onClose={() => {}}>
          {translate("resources.invoices.name", { smart_count: 1 })}{" "}
          <Link to={`/invoices/${data.id}`}>
            <strong>{data.reference}</strong>
          </Link>{" "}
          {translate("resources.sales_orders.notification.created_invoice", {
            reference: record.reference,
          })}
        </Alert>
      )}
      <TopToolbar {...rest}>
        <CreateInvoiceButton
          create={create}
          loading={loading || loadingReference}
        />
      </TopToolbar>
    </>
  );
};
