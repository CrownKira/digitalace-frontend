import "../../styles/transactions.scss";

import React, { FC, useState } from "react";
import {
  Edit,
  EditProps,
  Toolbar,
  FormWithRedirect,
  SaveButton,
  TabbedFormView,
  ReferenceField,
  DateField,
  TextField,
  NumberField,
  DeleteButton,
  Datagrid,
  Pagination,
  useNotify,
  useRefresh,
  Record,
  TopToolbar,
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
} from "./InvoiceCreate";
import { FormTabWithoutLayout } from "../../utils/components/FormTabWithoutLayout";
import { PdfButton } from "../components/PdfButton";
import { PrintButton } from "../components/PrintButton";
import { ReferenceManyFieldWithActions } from "../../utils/components/ReferenceManyFieldWithActions";
import { ApplyCreditsButton } from "./utils/ApplyCreditsButton";
import { CreateCreditNoteButton } from "./utils/CreateCreditNoteButton";
import { ApplyCreditsSection } from "./sections/ApplyCreditsSection";
import { LineItemsSection } from "../components/LineItemsSection";
import { DetailsTopSection } from "./sections/DetailsTopSection";
import { DetailsBottomSection } from "./sections/DetailsBottomSection";
import { PaymentSection } from "./sections/PaymentSection";
import { DetailsAlertSection } from "./sections/DetailsAlertSection";
import { CreditsAlertSection } from "./sections/CreditsAlertSection";
import { CreditsToolbar } from "./sections/CreditsToolbar";
import { Separator, SectionTitle } from "../../utils/components/Divider";

const useStyles = makeStyles({
  ...createStyles,
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
});

export const InvoiceEdit: FC<EditProps> = (props) => {
  return (
    <Edit component="div" mutationMode="pessimistic" {...props}>
      <InvoiceForm />
    </Edit>
  );
};

const InvoiceForm = (props: any) => {
  const classes = useStyles();
  const onFailure = useOnFailure();

  const getInitialTotals = () => {
    // TODO: rewrite using de-structure default
    // qn: can record be undefined?

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

  const [isPaid, setIsPaid] = useState(props.record?.status === "PD");
  const [openApplyCredits, setOpenApplyCredits] = useState(false);
  const [creditsAvailable, setCreditsAvailable] = useState(0);
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
    setOpenApplyCredits(false);
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
                    resource="invoices"
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
                    <PdfButton
                    // TODO: just use normal button
                    />
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
                <FormTabWithoutLayout label="resources.invoices.tabs.details">
                  <DetailsAlertSection
                    basePath={formProps.basePath}
                    record={formProps.record}
                    creditsAvailable={creditsAvailable}
                    totals={totals}
                  />
                  <Separator />
                  <DetailsTopSection
                    props={props}
                    isPaid={isPaid}
                    setIsPaid={setIsPaid}
                    openApplyCredits={openApplyCredits}
                    setOpenApplyCredits={setOpenApplyCredits}
                    setCreditsAvailable={setCreditsAvailable}
                  />
                  <LineItemsSection
                    source="invoiceitem_set"
                    resource="invoice_items"
                    label="resources.invoices.fields.invoiceitem_set"
                    updateTotals={updateTotals}
                  />
                  <DetailsBottomSection
                    totals={totals}
                    updateTotals={updateTotals}
                  />
                </FormTabWithoutLayout>
                {isPaid ? (
                  <FormTabWithoutLayout
                    /**
                     * TODO: hide tab when unpaid
                     * for some reason, this tab cannot be toggled using
                     * formProps?.form?.getFieldState('status')?.value === 'UPD' ? null : (...)
                     */
                    label="resources.invoices.tabs.record_payment"
                  >
                    <PaymentSection />
                  </FormTabWithoutLayout>
                ) : null}
                <FormTabWithoutLayout label="resources.invoices.tabs.credits_applied">
                  <CreditsAlertSection />
                  <Separator />
                  <SectionTitle label="resources.invoices.fieldGroups.credits_applied" />
                  <ReferenceManyFieldWithActions
                    reference="credits_applications"
                    target="invoice"
                    addLabel={false}
                    pagination={<Pagination />}
                    fullWidth
                    actions={
                      <CreditsToolbar
                        record={formProps.record}
                        setOpenApplyCredits={setOpenApplyCredits}
                        openApplyCredits={openApplyCredits}
                      />
                    }
                  >
                    <Datagrid>
                      <DateField source="date" />
                      <ReferenceField
                        source="credit_note"
                        reference="credit_notes"
                      >
                        <TextField source="reference" />
                      </ReferenceField>
                      <NumberField
                        label="resources.invoices.fields.credits_applied"
                        source="amount_to_credit"
                      />
                      <DeleteButton
                        mutationMode="pessimistic"
                        redirect={false}
                      />
                    </Datagrid>
                  </ReferenceManyFieldWithActions>
                  <Separator />
                  <ApplyCreditsSection
                    open={openApplyCredits}
                    setTotals={setTotals}
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
