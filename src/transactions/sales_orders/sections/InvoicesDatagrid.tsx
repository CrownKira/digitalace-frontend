import React, { FC } from "react";
import {
  DatagridProps,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  EditButton,
} from "react-admin";
import Alert from "@material-ui/lab/Alert";

import { Separator } from "../../../utils/components/Divider";
import { ColoredStatusField } from "../../components/ColoredStatusField";
import { statuses } from "../data";

export const InvoicesDatagrid: FC<DatagridProps> = (props) => {
  return (
    <div>
      <Alert severity="warning">
        <strong>Work in progress</strong> - Delivery Order feature
      </Alert>
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
