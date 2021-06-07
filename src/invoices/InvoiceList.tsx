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
import InvoiceShow from './InvoiceShow';

const ListFilters = (props: Omit<FilterProps, 'children'>) => (
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

const useStyles = makeStyles((theme) => ({
  hiddenOnSmallScreens: {
    display: 'table-cell',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
}));

// TODO: customizable table columns

const InvoiceList: FC<ListProps> = (props) => {
  const classes = useStyles();
  return (
    <List
      {...props}
      filters={<ListFilters />}
      perPage={25}
      sort={{ field: 'date', order: 'desc' }}
      bulkActionButtons={<InvoiceBulkActionButtons />}
    >
      <Datagrid rowClick="edit" expand={<InvoiceShow />}>
        <TextField source="id" />
        <DateField source="date" />
        <ReferenceField
          // TODO: remove _id
          source="customer_id"
          reference="customers"
          label="resources.invoices.fields.customer_id"
        >
          <FullNameField />
        </ReferenceField>
        <ReferenceField
          source="customer_id"
          reference="customers"
          link={false}
          label="resources.invoices.fields.address"
          cellClassName={classes.hiddenOnSmallScreens}
          headerClassName={classes.hiddenOnSmallScreens}
        >
          <AddressField />
        </ReferenceField>
        <ReferenceField
          source="sales_order"
          reference="sales_orders"
          label="resources.invoices.fields.sales_order"
        >
          <TextField source="id" />
        </ReferenceField>
        <NumberField source="status" />
        <NumberField source="grand_total" />
      </Datagrid>
    </List>
  );
};

export default InvoiceList;
