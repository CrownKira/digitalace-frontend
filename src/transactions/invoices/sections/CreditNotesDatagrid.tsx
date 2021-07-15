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

import { statuses } from "../../credit_notes/data";
import { Separator } from "../../../utils/components/Divider";
import { ColoredStatusField } from "../../components/ColoredStatusField";

export const CreditNotesDatagrid: FC<DatagridProps> = (props) => {
  const { total } = props;

  const translate = useTranslate();

  return (
    <div>
      {total === 0 ? (
        <Alert severity="info">
          {translate("resources.invoices.notification.no_credit_note")}
        </Alert>
      ) : (
        total !== undefined && (
          <Alert severity="info">
            {translate("resources.invoices.notification.total_credit_notes", {
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
        <NumberField source="credits_remaining" />
        <EditButton />
      </Datagrid>
    </div>
  );
};
