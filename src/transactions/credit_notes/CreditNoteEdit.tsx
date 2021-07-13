import React, { FC, useState } from "react";
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
} from "react-admin";
import { Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { useOnFailure } from "../../utils/hooks";
import {
  transform,
  styles as createStyles,
  Wrapper,
  validateForm,
  getTotals,
} from "./CreditNoteCreate";
import { FormTabWithoutLayout } from "../../utils/components/FormTabWithoutLayout";
import { PdfButton } from "../components/PdfButton";
import { PrintButton } from "../components/PrintButton";
import { LineItemsSection } from "../components/LineItemsSection";
import { DetailsTopSection } from "./sections/DetailsTopSection";
import { DetailsBottomSection } from "./sections/DetailsBottomSection";

const useStyles = makeStyles({
  ...createStyles,
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
});

export const CreditNoteEdit: FC<EditProps> = (props) => {
  return (
    <Edit component="div" mutationMode="pessimistic" {...props}>
      <CreditNoteForm />
    </Edit>
  );
};

const CreditNoteForm = (props: any) => {
  const classes = useStyles();
  const onFailure = useOnFailure();

  const getInitialTotals = () => {
    if (props.record) {
      const {
        total_amount,
        discount_amount,
        net,
        gst_amount,
        grand_total,
        balance_due,
        credits_applied,
      } = props.record;

      return {
        total_amount,
        discount_amount,
        net,
        gst_amount,
        grand_total,
        balance_due,
        credits_applied,
        amount_to_credit: 0,
      };
    }
    return {
      total_amount: 0,
      discount_amount: 0,
      net: 0,
      gst_amount: 0,
      grand_total: 0,
      balance_due: 0,
      credits_applied: 0,
      amount_to_credit: 0,
    };
  };

  // TODO: use context
  const [totals, setTotals] = useState(getInitialTotals());

  /**
   * You can have tooling support which checks and enforces these rules.
   * For example, eslint-plugin-react-hooks utilizes a heuristic that assumes,
   * a function starting with "use" prefix and a capital letter after it is a Hook.
   */
  const refresh = useRefresh();
  const notify = useNotify();

  const onSuccess = ({ data }: { data: Record }) => {
    notify(`Changes to "${data.reference}" saved`);
    refresh();
  };

  const updateTotals = (formData: any) => {
    // TODO: better way without passing formData?
    setTotals((totals) => ({ ...totals, ...getTotals(formData) }));
  };

  return (
    <FormWithRedirect
      validate={validateForm}
      {...props}
      render={(formProps: any) => {
        return (
          <Card>
            <Wrapper>
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
                        formProps.handleSubmitWithRedirect ||
                        formProps.handleSubmit
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
              </TabbedFormView>
            </Wrapper>
          </Card>
        );
      }}
    />
  );
};
