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

import { FullNameField } from "../../maintenance/customers/FullNameField";
import { AddressField } from "../../maintenance/customers/AddressField";
import { SalesOrderShow } from "./SalesOrderShow";
import { statuses } from "./data";
import { ColoredStatusField } from "../components/ColoredStatusField";
import { ListActionsWithImport } from "../../utils/components/ListActionsWithImport";
import { dateParser } from "../../utils";
import { useValidateRow } from "../hooks/useValidateRow";
import { validateReferenceUnicity } from "./SalesOrderCreate";

const ListFilters = (props: Omit<FilterProps, "children">) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <DateInput source="date__gte" />
    <DateInput source="date__lte" />
  </Filter>
);

// TODO: bulk action buttons props?
const SalesOrderBulkActionButtons: FC<BulkDeleteButtonProps> = (props) => (
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

  const salesOrderKeys = [
    "reference",
    "date",
    "description",
    "gst_rate",
    "discount_rate",
    "status",
    "customer",
    "salesperson",
  ];
  const getSalesOrderItem = (item: any) => {
    return item.salesorderitem_set;
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
      item.salesorderitem_set = [getSalesOrderItem(item)];
      const newItem = transform(pick(item, salesOrderKeys));
      acc.push(newItem);
      return acc;
    } else {
      acc[acc.length - 1].salesorderitem_set.push(getSalesOrderItem(item));
      return acc;
    }
  }, []);

  return Promise.resolve(newCsvRowItem);
};

// TODO: customizable table columns
export const SalesOrderList: FC<ListProps> = (props) => {
  const classes = useStyles();

  const requiredFields = [
    "date",
    "reference",
    "status",
    "customer",
    "salesorderitem_set",
  ];

  const validateRow = useValidateRow({
    validateReferenceUnicity,
    requiredFields,
  });

  return (
    <List
      filters={<ListFilters />}
      perPage={25}
      sort={{ field: "id", order: "DESC" }}
      bulkActionButtons={<SalesOrderBulkActionButtons />}
      actions={
        <ListActionsWithImport importConfig={{ transformRows, validateRow }} />
      }
      {...props}
    >
      <Datagrid rowClick="edit" expand={<SalesOrderShow />}>
        <TextField source="reference" />
        <DateField source="date" />
        <ReferenceField source="customer" reference="customers">
          <FullNameField />
        </ReferenceField>
        <ReferenceField
          source="customer"
          reference="customers"
          label="resources.customers.fields.address"
          link={false}
          cellClassName={classes.hiddenOnSmallScreens}
          headerClassName={classes.hiddenOnSmallScreens}
        >
          <AddressField />
        </ReferenceField>
        <ReferenceField source="invoice" reference="invoices">
          <TextField source="reference" />
        </ReferenceField>
        <ColoredStatusField source="status" choices={statuses} />
        <NumberField source="grand_total" />
      </Datagrid>
    </List>
  );
};
