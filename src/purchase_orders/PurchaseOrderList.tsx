import { Fragment } from "react";
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

import FullNameField from "../suppliers/FullNameField";
import AddressField from "../suppliers/AddressField";
import PurchaseOrderShow from "./PurchaseOrderShow";
import { statuses } from "./data";

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

// TODO: customizable table columns
const PurchaseOrderList: FC<ListProps> = (props) => {
  const classes = useStyles();
  return (
    <List
      filters={<ListFilters />}
      perPage={25}
      sort={{ field: "date", order: "desc" }}
      bulkActionButtons={<PurchaseOrderBulkActionButtons />}
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
        <SelectField source="status" choices={statuses} />
        <NumberField source="grand_total" />
      </Datagrid>
    </List>
  );
};

export default PurchaseOrderList;
