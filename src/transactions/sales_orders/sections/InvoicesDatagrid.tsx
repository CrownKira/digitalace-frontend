import React, { FC } from "react";
import {
  DatagridProps,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  EditButton,
  useTranslate,
} from "react-admin";
import Alert from "@material-ui/lab/Alert";

import { Separator } from "../../../utils/components/Divider";
import { ColoredStatusField } from "../../components/ColoredStatusField";
import { statuses } from "../data";

export const InvoicesDatagrid: FC<DatagridProps> = (props) => {
  const { total } = props;

  const translate = useTranslate();

  return (
    <div>
      <Alert severity="warning">
        <strong>Work in progress</strong> - Delivery Order feature
      </Alert>
      <Separator />
      {total === 0 ? (
        <Alert severity="info">
          {translate("resources.sales_orders.notification.no_invoice")}
        </Alert>
      ) : (
        total !== undefined && (
          <Alert severity="info">
            {translate("resources.sales_orders.notification.total_invoices", {
              smart_count: total,
            })}
          </Alert>
        )
      )}
      <Separator />
      <Datagrid {...props}>
        <TextField source="reference" />
        <DateField source="date" />
        <ColoredStatusField
          // TODO: use chip
          // https://marmelab.com/react-admin/Fields.html#choice-fields
          source="status"
          choices={statuses}
        />
        <NumberField source="grand_total" />
        <EditButton />
      </Datagrid>
    </div>
  );
};
