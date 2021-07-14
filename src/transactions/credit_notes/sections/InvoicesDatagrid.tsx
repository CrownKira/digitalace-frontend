import React, { FC } from "react";
import {
  DatagridProps,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  ReferenceField,
} from "react-admin";
import Alert from "@material-ui/lab/Alert";

import { Separator } from "../../../utils/components/Divider";

export const InvoicesDatagrid: FC<DatagridProps> = (props) => {
  return (
    <div>
      <Alert severity="warning">
        <strong>Work in progress</strong> - Apply to Invoice feature
      </Alert>
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
