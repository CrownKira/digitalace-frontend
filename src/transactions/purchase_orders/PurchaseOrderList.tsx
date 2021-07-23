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
import { PurchaseOrderShow } from "./PurchaseOrderShow";
import { statuses } from "./data";
import { ColoredStatusField } from "../components/ColoredStatusField";
import { ListActionsWithImport } from "../../utils/components/ListActionsWithImport";
import { dateParser } from "../../utils";
import { useValidateRow } from "../hooks/useValidateRow";
import { validateReferenceUnicity } from "./PurchaseOrderCreate";

const ListFilters = (props: Omit<FilterProps, "children">) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <DateInput source="date__gte" />
    <DateInput source="date__lte" />
  </Filter>
);

// TODO: bulk action buttons props?
const PurchaseOrderBulkActionButtons: FC<BulkDeleteButtonProps> = (props) => (
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

  const purchaseOrderKeys = [
    "reference",
    "date",
    "description",
    "gst_rate",
    "discount_rate",
    "status",
    "supplier",
  ];
  const getPurchaseOrderItem = (item: any) => {
    return item.purchaseorderitem_set;
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
      item.purchaseorderitem_set = [getPurchaseOrderItem(item)];
      const newItem = transform(pick(item, purchaseOrderKeys));
      acc.push(newItem);
      return acc;
    } else {
      acc[acc.length - 1].purchaseorderitem_set.push(
        getPurchaseOrderItem(item)
      );
      return acc;
    }
  }, []);

  return Promise.resolve(newCsvRowItem);
};

// TODO: customizable table columns
export const PurchaseOrderList: FC<ListProps> = (props) => {
  const classes = useStyles();

  const requiredFields = [
    "date",
    "reference",
    "status",
    "supplier",
    "purchaseorderitem_set",
  ];

  const validateRow = useValidateRow({
    validateReferenceUnicity,
    requiredFields,
    itemSetKey: "purchaseorderitem_set",
  });

  return (
    <List
      filters={<ListFilters />}
      perPage={25}
      sort={{ field: "id", order: "DESC" }}
      bulkActionButtons={<PurchaseOrderBulkActionButtons />}
      actions={
        <ListActionsWithImport importConfig={{ transformRows, validateRow }} />
      }
      {...props}
    >
      <Datagrid rowClick="edit" expand={<PurchaseOrderShow />}>
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
        <ReferenceField source="receive" reference="receives">
          <TextField source="reference" />
        </ReferenceField>
        <ColoredStatusField source="status" choices={statuses} />
        <NumberField source="grand_total" />
      </Datagrid>
    </List>
  );
};
