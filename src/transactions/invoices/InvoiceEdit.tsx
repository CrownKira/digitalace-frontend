import "../../styles/transactions.scss";

import React, { FC, useState } from "react";
import {
  Edit,
  EditProps,
  Toolbar,
  FormWithRedirect,
  FormDataConsumer,
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
} from "react-admin";
import { Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { useOnFailure } from "../../utils/hooks";
import {
  transform,
  styles as createStyles,
  Wrapper,
  validateForm,
} from "./InvoiceCreate";
import { FormTabWithCustomLayout } from "../../utils/components/FormTabWithCustomLayout";
import { PdfButton } from "../components/PdfButton";
import { PrintButton } from "../components/PrintButton";
import { ReferenceManyFieldWithActions } from "../../utils/components/ReferenceManyFieldWithActions";
import { CreditsApplicationListActions } from "./utils/CreditsApplicationListActions";
import { ApplyCreditsSection } from "./sections/ApplyCreditsSection";
import { LineItemsSection } from "../components/LineItemsSection";
import { DetailTopSection } from "./sections/DetailTopSection";
import { DetailBottomSection } from "./sections/DetailBottomSection";
import { PaymentSection } from "./sections/PaymentSection";
import { ProductNameInput } from "../components/ProductNameInput";

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
  // console.log("inv edit");

  const [state, setState] = useState({
    // TODO: make use of formProps instead?
    isPaid: props?.record?.status === "PD",
    openApplyCredits: false,
  });

  /**
   * You can have tooling support which checks and enforces these rules.
   * For example, eslint-plugin-react-hooks utilizes a heuristic that assumes,
   * a function starting with "use" prefix and a capital letter after it is a Hook.
   */
  const refresh = useRefresh();
  const notify = useNotify();

  const onSuccess = ({ data }: { data: Record }) => {
    notify(`Changes to "${data.reference}" saved`);
    setState({ ...state, openApplyCredits: false });
    refresh();
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
                <FormTabWithCustomLayout label="resources.invoices.tabs.details">
                  <DetailTopSection
                    props={props}
                    state={state}
                    setState={setState}
                  />
                  <LineItemsSection
                    source="invoiceitem_set"
                    resource="invoice_items"
                    label="resources.invoices.fields.invoiceitem_set"
                  />
                  <DetailBottomSection formProps={formProps} />
                </FormTabWithCustomLayout>
                {state.isPaid ? (
                  <FormTabWithCustomLayout
                    /**
                     * TODO: hide tab when unpaid
                     * for some reason, this tab cannot be toggled using
                     * formProps?.form?.getFieldState('status')?.value === 'UPD' ? null : (...)
                     */
                    label="resources.invoices.tabs.record_payment"
                  >
                    <PaymentSection />
                  </FormTabWithCustomLayout>
                ) : null}
                <FormTabWithCustomLayout label="resources.invoices.tabs.credits_applied">
                  <ReferenceManyFieldWithActions
                    reference="credits_applications"
                    target="invoice"
                    addLabel={false}
                    pagination={<Pagination />}
                    fullWidth
                    actions={
                      <CreditsApplicationListActions
                        onClick={() => {
                          setState({ ...state, openApplyCredits: true });
                        }}
                        disabled={state.openApplyCredits}
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
                  <ApplyCreditsSection
                    formProps={formProps}
                    open={state.openApplyCredits}
                  />
                </FormTabWithCustomLayout>
              </TabbedFormView>
            </Wrapper>
          </Card>
        );
      }}
    />
  );
};
