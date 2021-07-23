import React, { Fragment } from "react";
import { FC } from "react";
import {
  List,
  ListProps,
  Datagrid,
  TextField,
  DateField,
  ReferenceField,
  NumberField,
  Filter,
  FilterProps,
  SearchInput,
  DateInput,
  BulkDeleteButton,
  BulkDeleteButtonProps,
} from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import pick from "lodash/pick";

import { FullNameField } from "../../maintenance/suppliers/FullNameField";
import { AddressField } from "../../maintenance/suppliers/AddressField";
import { ReceiveShow } from "./ReceiveShow";
import { statuses } from "./data";
import { ColoredStatusField } from "../components/ColoredStatusField";
import { ListActionsWithImport } from "../../utils/components/ListActionsWithImport";
import { dateParser } from "../../utils";
import { useValidateRow } from "../hooks/useValidateRow";
import { validateReferenceUnicity } from "./ReceiveCreate";

const ListFilters = (props: Omit<FilterProps, "children">) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <DateInput source="date__gte" />
    <DateInput source="date__lte" />
  </Filter>
);

// TODO: bulk action buttons props?
const ReceiveBulkActionButtons: FC<BulkDeleteButtonProps> = (props) => (
  <Fragment>
    <BulkDeleteButton {...props} />
  </Fragment>
);

const useStyles = makeStyles((theme) => ({
  hiddenOnSmallScreens: {
    display: "table-cell",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));

const transformRows = (csvRows: any[]): Promise<any[]> => {
  if (csvRows.length === 0) {
    return Promise.resolve(csvRows);
  }

  const receiveKeys = [
    "reference",
    "date",
    "description",
    "gst_rate",
    "discount_rate",
    "status",
    "supplier",
  ];
  const getReceiveItem = (item: any) => {
    return item.receiveitem_set;
  };

  const transform = (data: any): any => {
    return {
      ...data,
      date: dateParser(data.date),
      description: data.description || "",
    };
  };

  const newCsvRowItem = csvRows.reduce((acc, item) => {
    if (item.reference) {
      item.receiveitem_set = [getReceiveItem(item)];
      const newItem = transform(pick(item, receiveKeys));
      acc.push(newItem);
      return acc;
    } else {
      acc[acc.length - 1].receiveitem_set.push(getReceiveItem(item));
      return acc;
    }
  }, []);

  return Promise.resolve(newCsvRowItem);
};

// TODO: customizable table columns
export const ReceiveList: FC<ListProps> = (props) => {
  const classes = useStyles();

  const requiredFields = [
    "date",
    "reference",
    "status",
    "supplier",
    "receiveitem_set",
  ];

  const validateRow = useValidateRow({
    validateReferenceUnicity,
    requiredFields,
    itemSetKey: "receiveitem_set",
  });

  return (
    <List
      filters={<ListFilters />}
      perPage={25}
      sort={{ field: "id", order: "DESC" }}
      bulkActionButtons={<ReceiveBulkActionButtons />}
      actions={
        <ListActionsWithImport importConfig={{ transformRows, validateRow }} />
      }
      {...props}
    >
      <Datagrid rowClick="edit" expand={<ReceiveShow />}>
        <TextField source="reference" />
        <DateField source="date" />
        <ReferenceField source="supplier" reference="suppliers">
          <FullNameField />
        </ReferenceField>
        <ReferenceField
          source="supplier"
          reference="suppliers"
          label="resources.suppliers.fields.address"
          link={false}
          cellClassName={classes.hiddenOnSmallScreens}
          headerClassName={classes.hiddenOnSmallScreens}
        >
          <AddressField />
        </ReferenceField>
        <ReferenceField source="purchase_order" reference="purchase_orders">
          <TextField source="reference" />
        </ReferenceField>
        <ColoredStatusField source="status" choices={statuses} />
        <NumberField source="grand_total" />
      </Datagrid>
    </List>
  );
};
