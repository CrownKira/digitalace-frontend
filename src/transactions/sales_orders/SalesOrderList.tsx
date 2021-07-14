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
  SelectField,
} from "react-admin";
import { makeStyles } from "@material-ui/core/styles";

import { FullNameField } from "../../maintenance/customers/FullNameField";
import { AddressField } from "../../maintenance/customers/AddressField";
import { SalesOrderShow } from "./SalesOrderShow";
import { statuses } from "./data";

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

// TODO: customizable table columns
export const SalesOrderList: FC<ListProps> = (props) => {
  const classes = useStyles();
  return (
    <List
      filters={<ListFilters />}
      perPage={25}
      sort={{ field: "date", order: "desc" }}
      bulkActionButtons={<SalesOrderBulkActionButtons />}
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
        <SelectField source="status" choices={statuses} />
        <NumberField source="grand_total" />
      </Datagrid>
    </List>
  );
};