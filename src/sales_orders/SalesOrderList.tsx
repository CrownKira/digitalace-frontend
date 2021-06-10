import { Fragment } from 'react';
import { FC } from 'react';
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
} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

import FullNameField from '../customers/FullNameField';
import AddressField from '../customers/AddressField';
import SalesOrderShow from './SalesOrderShow';

const ListFilters = (props: Omit<FilterProps, 'children'>) => (
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
    display: 'table-cell',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
}));

// TODO: customizable table columns

const SalesOrderList: FC<ListProps> = (props) => {
  const classes = useStyles();
  return (
    <List
      {...props}
      filters={<ListFilters />}
      perPage={25}
      sort={{ field: 'date', order: 'desc' }}
      bulkActionButtons={<SalesOrderBulkActionButtons />}
    >
      <Datagrid rowClick="edit" expand={<SalesOrderShow />}>
        <TextField source="id" />
        <DateField source="date" />
        <ReferenceField
          // TODO: remove _id
          source="customer"
          reference="customers"
          label="resources.sales_orders.fields.customer"
        >
          <FullNameField />
        </ReferenceField>
        <ReferenceField
          source="customer"
          reference="customers"
          link={false}
          label="resources.sales_orders.fields.address"
          cellClassName={classes.hiddenOnSmallScreens}
          headerClassName={classes.hiddenOnSmallScreens}
        >
          <AddressField />
        </ReferenceField>
        <ReferenceField
          source="invoice"
          reference="invoices"
          label="resources.sales_orders.fields.invoice"
        >
          <TextField source="id" />
        </ReferenceField>
        <NumberField source="status" />
        <NumberField source="grand_total" />
      </Datagrid>
    </List>
  );
};

export default SalesOrderList;
