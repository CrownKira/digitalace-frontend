import { Fragment } from "react";
import React, { FC } from "react";
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
import { InvoiceShow } from "./InvoiceShow";
import { statuses } from "./data";
import { ColoredStatusField } from "../components/ColoredStatusField";
import { ListActionsWithImport } from "../../utils/components/ListActionsWithImport";
import { dateParser } from "../../utils";

const useStyles = makeStyles((theme) => ({
  hiddenOnSmallScreens: {
    display: "table-cell",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));

const ListFilters = (props: Omit<FilterProps, "children">) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <DateInput source="date__gte" />
    <DateInput source="date__lte" />
  </Filter>
);

// TODO: bulk action buttons props?
const InvoiceBulkActionButtons: FC<BulkDeleteButtonProps> = (props) => (
  <Fragment>
    <BulkDeleteButton {...props} />
  </Fragment>
);

const transformRows = (csvRowItem: any[]): Promise<any[]> => {
  if (csvRowItem.length === 0) {
    return Promise.resolve(csvRowItem);
  }

  const invoiceKeys = [
    "reference",
    "date",
    "description",
    "payment_date",
    "payment_method",
    "payment_note",
    "gst_rate",
    "discount_rate",
    "customer",
    "salesperson",
    "sales_order",
    "status",
    "invoiceitem_set",
    "creditsapplication_set",
  ];
  const getInvoiceItem = (item: any) => {
    return item.invoiceitem_set;
  };

  const transform = (data: any): any => {
    return {
      ...data,
      date: dateParser(data.date),
      payment_date: dateParser(data.payment_date),
      description: data.description || "",
      payment_note: data.payment_note || "",
    };
  };

  const newCsvRowItem = csvRowItem.reduce((acc, item) => {
    if (item.reference) {
      item.invoiceitem_set = [getInvoiceItem(item)];
      item.creditsapplication_set = [];
      const newItem = transform(pick(item, invoiceKeys));
      acc.push(newItem);
      return acc;
    } else {
      acc[acc.length - 1].invoiceitem_set.push(getInvoiceItem(item));
      return acc;
    }
  }, []);

  return Promise.resolve(newCsvRowItem);
};

// TODO: customizable table columns
export const InvoiceList: FC<ListProps> = (props) => {
  const classes = useStyles();
  return (
    <List
      filters={<ListFilters />}
      perPage={25}
      sort={{ field: "date", order: "desc" }}
      bulkActionButtons={<InvoiceBulkActionButtons />}
      actions={<ListActionsWithImport importConfig={{ transformRows }} />}
      {...props}
    >
      <Datagrid rowClick="edit" expand={<InvoiceShow />}>
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
        <ReferenceField source="sales_order" reference="sales_orders">
          <TextField source="reference" />
        </ReferenceField>
        <ColoredStatusField
          // TODO: use chip
          // https://marmelab.com/react-admin/Fields.html#choice-fields
          source="status"
          choices={statuses}
        />
        <NumberField source="grand_total" />
      </Datagrid>
    </List>
  );
};
