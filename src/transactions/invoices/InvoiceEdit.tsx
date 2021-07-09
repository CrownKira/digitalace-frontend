import { FC, useState } from "react";
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
import { FormTabWithLayout } from "./utils/FormTabWithCustomLayout";
import PdfButton from "./buttons/PdfButton";
import PrintButton from "./buttons/PrintButton";
import ReferenceManyFieldWithActions from "../../orders/sales_orders/ReferenceManyFieldWithActions";
import CreditsApplicationListActions from "./utils/CreditsApplicationListActions";
import ApplyCreditsSection from "./sections/ApplyCreditsSection";
import LineItemsSection from "./sections/LineItemsSection";
import InvoiceSectionTop from "./sections/InvoiceSectionTop";
import InvoiceSectionBottom from "./sections/InvoiceSectionBottom";
import PaymentSection from "./sections/PaymentSection";

const useStyles = makeStyles({
  ...createStyles,
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
});

const InvoiceEdit: FC<EditProps> = (props) => {
  return (
    <Edit component="div" mutationMode="pessimistic" {...props}>
      <InvoiceForm />
    </Edit>
  );
};

const InvoiceForm = (props: any) => {
  const classes = useStyles();
  const onFailure = useOnFailure();

  const [state, setState] = useState({
    // TODO: make use of formProps instead?
    isPaid: props?.record?.status === "PD",
    openApplyCredits: false,
  });

  const refresh = useRefresh();
  const notify = useNotify();

  const onSuccess = ({ data }: { data: Record }) => {
    notify(`Changes to "${data.reference}" saved`);
    setState({ ...state, openApplyCredits: false });
    refresh();
  };

  /**
   * You can have tooling support which checks and enforces these rules.
   * For example, eslint-plugin-react-hooks utilizes a heuristic that assumes,
   * a function starting with "use" prefix and a capital letter after it is a Hook.
   */

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
                <FormTabWithLayout label="resources.invoices.tabs.details">
                  <InvoiceSectionTop
                    props={props}
                    state={state}
                    setState={setState}
                  />
                  <LineItemsSection />
                  <InvoiceSectionBottom formProps={formProps} />
                </FormTabWithLayout>
                {state.isPaid ? (
                  <FormTabWithLayout
                    /**
                     * TODO: hide tab when unpaid
                     * for some reason, this tab cannot be toggled using
                     * formProps?.form?.getFieldState('status')?.value === 'UPD' ? null : (...)
                     */
                    label="resources.invoices.tabs.record_payment"
                  >
                    <PaymentSection />
                  </FormTabWithLayout>
                ) : null}
                <FormTabWithLayout label="resources.invoices.tabs.credits_applied">
                  <FormDataConsumer>
                    {({ formData }) => (
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
                            formData={formData}
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
                    )}
                  </FormDataConsumer>
                  <ApplyCreditsSection
                    formProps={formProps}
                    open={state.openApplyCredits}
                  />
                </FormTabWithLayout>
              </TabbedFormView>
            </Wrapper>
          </Card>
        );
      }}
    />
  );
};

export default InvoiceEdit;
