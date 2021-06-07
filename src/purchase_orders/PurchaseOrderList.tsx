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

import FullNameField from '../suppliers/FullNameField';
import AddressField from '../suppliers/AddressField';
import PurchaseOrderShow from './PurchaseOrderShow';

const ListFilters = (props: Omit<FilterProps, 'children'>) => (
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
    display: 'table-cell',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
}));

// TODO: customizable table columns
const PurchaseOrderList: FC<ListProps> = (props) => {
  const classes = useStyles();
  return (
    <List
      {...props}
      filters={<ListFilters />}
      perPage={25}
      sort={{ field: 'date', order: 'desc' }}
      bulkActionButtons={<PurchaseOrderBulkActionButtons />}
    >
      <Datagrid rowClick="edit" expand={<PurchaseOrderShow />}>
        <TextField source="id" />
        <DateField source="date" />
        <ReferenceField
          // TODO: remove _id
          source="supplier"
          reference="suppliers"
          label="resources.purchase_orders.fields.supplier"
        >
          <FullNameField />
        </ReferenceField>
        <ReferenceField
          source="supplier"
          reference="suppliers"
          link={false}
          label="resources.purchase_orders.fields.address"
          cellClassName={classes.hiddenOnSmallScreens}
          headerClassName={classes.hiddenOnSmallScreens}
        >
          <AddressField />
        </ReferenceField>
        <ReferenceField
          source="receive"
          reference="receives"
          label="resources.purchase_orders.fields.receive"
        >
          <TextField source="id" />
        </ReferenceField>
        <NumberField source="status" />
        <NumberField source="grand_total" />
      </Datagrid>
    </List>
  );
};

export default PurchaseOrderList;
