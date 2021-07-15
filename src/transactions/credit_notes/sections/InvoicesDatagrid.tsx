import React, { FC } from "react";
import {
  DatagridProps,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  ReferenceField,
  useTranslate,
} from "react-admin";
import Alert from "@material-ui/lab/Alert";

import { Separator } from "../../../utils/components/Divider";

export const InvoicesDatagrid: FC<DatagridProps> = (props) => {
  const { total } = props;

  const translate = useTranslate();

  return (
    <div>
      <Alert severity="warning">
        <strong>Work in progress</strong> - Apply to Invoice feature
      </Alert>
      <Separator />
      {total === 0 ? (
        <Alert severity="info">
          {translate("resources.credit_notes.notification.no_invoice")}
        </Alert>
      ) : (
        total !== undefined && (
          <Alert severity="info">
            {translate("resources.credit_notes.notification.total_invoices", {
              smart_count: total,
            })}
          </Alert>
        )
      )}
      <Separator />
      <Datagrid {...props}>
        <DateField source="date" />
        <ReferenceField
          source="invoice"
          reference="invoices"
          label="resources.invoices.fields.reference"
        >
          <TextField source="reference" />
        </ReferenceField>
        <NumberField
          source="amount_to_credit"
          label="resources.invoices.fields.credits_applied"
        />
      </Datagrid>
    </div>
  );
};
