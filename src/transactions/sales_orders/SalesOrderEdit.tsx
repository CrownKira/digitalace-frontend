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
  Datagrid,
  TextField,
  DateField,
  SelectField,
  NumberField,
  EditButton,
  Pagination,
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
} from "./SalesOrderCreate";
import { FormTabWithoutLayout } from "../../utils/components/FormTabWithoutLayout";
import { ReferenceManyFieldWithActions } from "../../utils/components/ReferenceManyFieldWithActions";
import { PdfButton } from "../components/PdfButton";
import { PrintButton } from "../components/PrintButton";
import { LineItemsSection } from "../components/LineItemsSection";
import { DetailsTopSection } from "./sections/DetailsTopSection";
import { DetailsBottomSection } from "./sections/DetailsBottomSection";
import { statuses as invoiceStatuses } from "../../transactions/invoices/data";

const useStyles = makeStyles({
  ...createStyles,
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
});

export const SalesOrderEdit: FC<EditProps> = (props) => {
  return (
    <Edit component="div" mutationMode="pessimistic" {...props}>
      <SalesOrderForm />
    </Edit>
  );
};

// FIXME: fix any
const InvoiceListActions = (props: any) => <TopToolbar></TopToolbar>;

const SalesOrderForm = (props: any) => {
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
                    resource="sales_orders"
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
                <FormTabWithoutLayout label="resources.sales_orders.tabs.details">
                  <DetailsTopSection props={props} />
                  <LineItemsSection
                    source="salesorderitem_set"
                    resource="sales_order_items"
                    label="resources.sales_orders.fields.salesorderitem_set"
                    updateTotals={updateTotals}
                  />
                  <DetailsBottomSection
                    totals={totals}
                    updateTotals={updateTotals}
                  />
                </FormTabWithoutLayout>
                <FormTabWithoutLayout label="resources.sales_orders.tabs.invoices">
                  <ReferenceManyFieldWithActions
                    reference="invoices"
                    target="sales_order"
                    addLabel={false}
                    pagination={<Pagination />}
                    fullWidth
                    actions={<InvoiceListActions />}
                  >
                    <Datagrid>
                      <TextField source="reference" />
                      <DateField source="date" />
                      <SelectField
                        // TODO: use chip
                        // https://marmelab.com/react-admin/Fields.html#choice-fields
                        source="status"
                        choices={invoiceStatuses}
                      />
                      <NumberField source="grand_total" />
                      <EditButton />
                    </Datagrid>
                  </ReferenceManyFieldWithActions>
                </FormTabWithoutLayout>
              </TabbedFormView>
            </Wrapper>
          </Card>
        );
      }}
    />
  );
};
