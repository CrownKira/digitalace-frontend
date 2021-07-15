import React, { FC, useEffect, useRef, useState } from "react";
import {
  TopToolbar,
  useTranslate,
  useMutation,
  Record,
  useNotify,
  Link,
  linkToRecord,
} from "react-admin";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";

import { CreateInvoiceButton } from "./CreateInvoiceButton";
import {
  dateFormatter,
  getErrorMessage,
  getNextReference,
} from "../../../utils";
import { useGetNextReference } from "../../hooks/useGetNextReference";
import { Fade } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  alert: {
    position: "fixed",
    top: "5%",
    left: "50%",
    transform: "translate(-50%,0%)",
    zIndex: 9999,
  },
}));

interface Props {
  record: Record;
}

export const InvoicesToolbar: FC<Props> = ({ record, ...rest }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const notify = useNotify();
  const { reference, loading: loadingReference } = useGetNextReference({
    resource: "invoices",
    prefix: "INV",
  });
  const [mutate, { loading, loaded, data, error }] = useMutation();
  const nextReference = useRef("");
  const [isAlertOpen, setIsAlertOpen] = useState(true);

  const create = () => {
    if (nextReference.current) {
      nextReference.current = getNextReference(nextReference.current, "INV");
    } else {
      nextReference.current = reference;
    }
    const result = mutate({
      type: "create",
      resource: "invoices",
      payload: {
        data: {
          reference: nextReference.current,
          sales_order: record.id,
          customer: record.customer,
          invoiceitem_set: record.salesorderitem_set,
          salesperson: record.salesperson,
          date: dateFormatter(new Date()),
          gst_rate: record.gst_rate,
          discount_rate: record.discount_rate,
          refund: 0,
          creditsapplication_set: [],
        },
      },
    });

    setIsAlertOpen(true);
    return result;
  };

  useEffect(() => {
    if (error) {
      notify(getErrorMessage(error), "warning");
    }
  }, [error, notify]);

  return (
    <>
      {loaded && (
        <Fade in={isAlertOpen}>
          <Alert
            severity="success"
            onClose={() => {
              setIsAlertOpen(false);
            }}
            className={classes.alert}
          >
            {translate("resources.invoices.name", { smart_count: 1 })}{" "}
            <Link to={linkToRecord("/invoices", data.id)}>
              <strong>{data.reference}</strong>
            </Link>{" "}
            {translate("resources.sales_orders.notification.created_invoice", {
              reference: record.reference,
            })}
          </Alert>
        </Fade>
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
