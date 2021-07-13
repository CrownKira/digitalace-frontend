import React, { FC } from "react";
import {
  useMutation,
  TopToolbar,
  useRedirect,
  useTranslate,
  Record,
} from "react-admin";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";

import { ApplyCreditsButton } from "../utils/ApplyCreditsButton";
import { CreateCreditNoteButton } from "../utils/CreateCreditNoteButton";

interface Props {
  record: Record;
  openApplyCredits: boolean;
  setOpenApplyCredits: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreditsToolbar: FC<Props> = ({
  record,
  openApplyCredits,
  setOpenApplyCredits,
  ...rest
}) => {
  const redirect = useRedirect();
  const translate = useTranslate();
  const [create, { loading, loaded, data }] = useMutation({
    type: "create",
    resource: "credit_notes",
    payload: {
      data: {
        created_from: record.id,
        customer: record.customer,
        creditnoteitem_set: record.invoiceitem_set,
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
                redirect(`credit_notes/${data.id}`);
              }}
            >
              {translate("resources.invoices.action.view")}
            </Button>
          }
        >
          {translate("resources.invoices.notification.created_credit_note", {
            reference: data.reference,
          })}
        </Alert>
      )}
      <TopToolbar {...rest}>
        <ApplyCreditsButton
          onClick={() => {
            setOpenApplyCredits(true);
          }}
          disabled={openApplyCredits}
        />
        <CreateCreditNoteButton create={create} loading={loading} />
      </TopToolbar>
    </>
  );
};
