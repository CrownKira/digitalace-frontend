import React, { FC, useEffect, useRef } from "react";
import {
  useMutation,
  TopToolbar,
  useTranslate,
  Record,
  useNotify,
  Link,
} from "react-admin";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

import { CreateCreditNoteButton } from "../utils/CreateCreditNoteButton";
import {
  dateFormatter,
  getErrorMessage,
  getNextReference,
} from "../../../utils";
import { useGetNextReference } from "../../hooks/useGetNextReference";

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

export const CreditNotesToolbar: FC<Props> = ({ record, ...rest }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const notify = useNotify();
  const { reference, loading: loadingReference } = useGetNextReference({
    resource: "credit_notes",
    prefix: "CN",
  });
  const [mutate, { loading, loaded, data, error }] = useMutation();
  const nextReference = useRef("");

  const create = () => {
    // TODO: better way?
    // must ensure that reference is ready when this function is called
    if (nextReference.current) {
      nextReference.current = getNextReference(nextReference.current, "CN");
    } else {
      nextReference.current = reference;
    }
    return mutate({
      type: "create",
      resource: "credit_notes",
      payload: {
        data: {
          reference: nextReference.current,
          created_from: record.id,
          customer: record.customer,
          creditnoteitem_set: record.invoiceitem_set,
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
        <Alert severity="success" onClose={() => {}} className={classes.alert}>
          {translate("resources.credit_notes.name", { smart_count: 1 })}{" "}
          <Link to={`/credit_notes/${data.id}`}>
            <strong>{data.reference}</strong>
          </Link>{" "}
          {translate("resources.invoices.notification.created_credit_note", {
            reference: record.reference,
          })}
        </Alert>
      )}
      <TopToolbar {...rest}>
        <CreateCreditNoteButton
          create={create}
          loading={loading || loadingReference}
        />
      </TopToolbar>
    </>
  );
};
