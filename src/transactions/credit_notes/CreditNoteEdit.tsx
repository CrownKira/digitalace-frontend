import React, { FC, useState, useCallback, useEffect } from "react";
import {
  Edit,
  EditProps,
  Toolbar,
  FormWithRedirect,
  SaveButton,
  TabbedFormView,
  DeleteButton,
  useNotify,
  useRefresh,
  Record,
  Pagination,
  EditActionsProps,
  TopToolbar,
  ListButton,
} from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import ChevronLeft from "@material-ui/icons/ChevronLeftTwoTone";

import { useOnFailure } from "../../utils/hooks";
import {
  transform,
  styles as createStyles,
  validateForm,
  getTotals,
} from "./CreditNoteCreate";
import { FormTabWithoutLayout } from "../../utils/components/FormTabWithoutLayout";
import { ReferenceManyFieldWithActions } from "../../utils/components/ReferenceManyFieldWithActions";
import { PdfButton } from "../components/PdfButton";
import { PrintButton } from "../components/PrintButton";
import { LineItemsSection } from "../components/LineItemsSection";
import { DetailsTopSection } from "./sections/DetailsTopSection";
import { DetailsBottomSection } from "./sections/DetailsBottomSection";
import { DetailsAlertSection } from "./sections/DetailsAlertSection";
import { Separator } from "../../utils/components/Divider";
import { InvoicesDatagrid } from "./sections/InvoicesDatagrid";

const useStyles = makeStyles({
  ...createStyles,
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
});

const PostEditActions: FC<EditActionsProps> = ({ basePath }) => (
  <TopToolbar>
    <ListButton basePath={basePath} label="Back" icon={<ChevronLeft />} />
    <PdfButton />
    <PrintButton />
  </TopToolbar>
);

export const CreditNoteEdit: FC<EditProps> = (props) => {
  return (
    <Edit actions={<PostEditActions />} mutationMode="pessimistic" {...props}>
      <CreditNoteForm />
    </Edit>
  );
};

const CreditNoteForm = (props: any) => {
  const classes = useStyles();
  const refresh = useRefresh();
  const notify = useNotify();
  const onFailure = useOnFailure();
  const onSuccess = ({ data }: { data: Record }) => {
    notify(`Changes to "${data.reference}" saved`);
    refresh();
  };

  const getInitialTotals = useCallback(() => {
    const {
      total_amount = 0,
      discount_amount = 0,
      net = 0,
      gst_amount = 0,
      grand_total = 0,
      balance_due = 0,
      credits_applied = 0,
      credits_used = 0,
      credits_remaining = 0,
      amount_to_credit = 0,
    } = props.record;

    return {
      total_amount,
      discount_amount,
      net,
      gst_amount,
      grand_total,
      balance_due,
      credits_applied,
      credits_used,
      credits_remaining,
      amount_to_credit,
    };
  }, [props.record]);
  const [totals, setTotals] = useState(getInitialTotals());
  const updateTotals = (formData: any) => {
    // TODO: better way without passing formData?
    setTotals((totals) => ({ ...totals, ...getTotals(formData) }));
  };

  useEffect(() => {
    setTotals(getInitialTotals());
  }, [getInitialTotals, props.record]);

  return (
    <FormWithRedirect
      warnWhenUnsavedChanges
      validate={validateForm}
      {...props}
      render={(formProps: any) => {
        return (
          <TabbedFormView
            {...formProps}
            toolbar={
              <Toolbar
                // props from react-admin demo VisitorEdit
                resource="credit_notes"
                record={formProps.record}
                basePath={formProps.basePath}
                invalid={formProps.invalid}
                handleSubmit={formProps.handleSubmit}
                saving={formProps.saving}
                pristine={formProps.pristine}
                classes={{ toolbar: classes.toolbar }}
              >
                <SaveButton
                  // props from Toolbar.tsx
                  // TODO: disable when pristine?
                  handleSubmitWithRedirect={
                    formProps.handleSubmitWithRedirect || formProps.handleSubmit
                  }
                  disabled={formProps.disabled}
                  invalid={formProps.invalid}
                  redirect={formProps.redirect}
                  saving={formProps.saving}
                  submitOnEnter={formProps.submitOnEnter}
                  transform={transform}
                  onFailure={onFailure}
                  onSuccess={onSuccess}
                />
                <PdfButton />
                <PrintButton />
                {formProps.record && formProps.record.id !== undefined && (
                  <DeleteButton
                    // props from Toolbar.tsx
                    basePath={formProps.basePath}
                    record={formProps.record}
                    resource={formProps.resource}
                    mutationMode={formProps.mutationMode}
                  />
                )}
              </Toolbar>
            }
          >
            <FormTabWithoutLayout label="resources.credit_notes.tabs.details">
              <DetailsAlertSection record={formProps.record} />
              <Separator />
              <DetailsTopSection props={props} />
              <LineItemsSection
                source="creditnoteitem_set"
                resource="credit_note_items"
                label="resources.credit_notes.fields.creditnoteitem_set"
                updateTotals={updateTotals}
              />
              <DetailsBottomSection
                totals={totals}
                updateTotals={updateTotals}
              />
            </FormTabWithoutLayout>
            <FormTabWithoutLayout label="resources.credit_notes.tabs.invoices_credited">
              <ReferenceManyFieldWithActions
                reference="credits_applications"
                target="credit_note"
                addLabel={false}
                pagination={<Pagination />}
                fullWidth
              >
                <InvoicesDatagrid />
              </ReferenceManyFieldWithActions>
            </FormTabWithoutLayout>
          </TabbedFormView>
        );
      }}
    />
  );
};
