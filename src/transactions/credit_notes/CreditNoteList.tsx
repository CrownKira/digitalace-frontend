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
import { CreditNoteShow } from "./CreditNoteShow";
import { statuses } from "./data";
import { ColoredStatusField } from "../components/ColoredStatusField";
import { ListActionsWithImport } from "../../utils/components/ListActionsWithImport";
import { dateParser } from "../../utils";
import { validateReferenceUnicity } from "./CreditNoteCreate";
import { useValidateRow } from "../hooks/useValidateRow";

const ListFilters = (props: Omit<FilterProps, "children">) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <DateInput source="date__gte" />
    <DateInput source="date__lte" />
  </Filter>
);

// TODO: bulk action buttons props?
const CreditNoteBulkActionButtons: FC<BulkDeleteButtonProps> = (props) => (
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

  const creditNoteKeys = [
    "reference",
    "date",
    "description",
    "gst_rate",
    "discount_rate",
    "customer",
    "salesperson",
    "status",
    "refund",
    "created_from",
  ];
  const getCreditNoteItem = (item: any) => {
    return item.creditnoteitem_set;
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
      item.creditnoteitem_set = [getCreditNoteItem(item)];
      const newItem = transform(pick(item, creditNoteKeys));
      acc.push(newItem);
      return acc;
    } else {
      acc[acc.length - 1].creditnoteitem_set.push(getCreditNoteItem(item));
      return acc;
    }
  }, []);

  return Promise.resolve(newCsvRowItem);
};

// TODO: customizable table columns
export const CreditNoteList: FC<ListProps> = (props) => {
  const classes = useStyles();

  const requiredFields = [
    "date",
    "reference",
    "status",
    "customer",
    "creditnoteitem_set",
  ];

  const validateRow = useValidateRow({
    validateReferenceUnicity,
    requiredFields,
  });

  return (
    <List
      filters={<ListFilters />}
      perPage={25}
      sort={{ field: "date", order: "desc" }}
      bulkActionButtons={<CreditNoteBulkActionButtons />}
      actions={
        <ListActionsWithImport importConfig={{ transformRows, validateRow }} />
      }
      {...props}
    >
      <Datagrid rowClick="edit" expand={<CreditNoteShow />}>
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
