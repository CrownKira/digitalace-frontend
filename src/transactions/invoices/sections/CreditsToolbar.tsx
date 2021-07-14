import React, { FC, useEffect } from "react";
import {
  useMutation,
  TopToolbar,
  useRedirect,
  useTranslate,
  Record,
  useNotify,
  Link,
} from "react-admin";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

import { ApplyCreditsButton } from "../utils/ApplyCreditsButton";
import { CreateCreditNoteButton } from "../utils/CreateCreditNoteButton";
import { dateFormatter, getErrorMessage } from "../../../utils";
import { useGetIncrementedReference } from "../../hooks/useGetIncrementedReference";

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
  IsApplyCreditsOpen: boolean;
  setApplyCreditsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreditsToolbar: FC<Props> = ({
  record,
  IsApplyCreditsOpen,
  setApplyCreditsOpen,
  ...rest
}) => {
  const classes = useStyles();
  const redirect = useRedirect();
  const translate = useTranslate();
  const notify = useNotify();
  const { reference, loading: loadingReference } = useGetIncrementedReference({
    resource: "credit_notes",
    prefix: "CN",
  });
  const [mutate, { loading, loaded, data, error }] = useMutation();

  const create = () => {
    // TODO: better way?
    // must ensure that reference is ready when this function is called
    return mutate({
      type: "create",
      resource: "credit_notes",
      payload: {
        data: {
          reference,
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
        <ApplyCreditsButton
          onClick={() => {
            setApplyCreditsOpen(true);
          }}
          disabled={IsApplyCreditsOpen}
        />
        <CreateCreditNoteButton
          create={create}
          loading={loading || loadingReference}
        />
      </TopToolbar>
    </>
  );
};
