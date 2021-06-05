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
import ReceiveShow from './ReceiveShow';

const ListFilters = (props: Omit<FilterProps, 'children'>) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <DateInput source="date_gte" />
    <DateInput source="date_lte" />
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
    display: 'table-cell',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
}));

// TODO: customizable table columns
const ReceiveList: FC<ListProps> = (props) => {
  const classes = useStyles();
  return (
    <List
      {...props}
      filters={<ListFilters />}
      perPage={25}
      sort={{ field: 'date', order: 'desc' }}
      bulkActionButtons={<ReceiveBulkActionButtons />}
    >
      <Datagrid rowClick="edit" expand={<ReceiveShow />}>
        <TextField source="id" />
        <DateField source="date" />
        <ReferenceField
          // TODO: remove _id
          source="supplier"
          reference="suppliers"
          label="resources.receives.fields.supplier"
        >
          <FullNameField />
        </ReferenceField>
        <ReferenceField
          source="supplier"
          reference="suppliers"
          link={false}
          label="resources.receives.fields.address"
          cellClassName={classes.hiddenOnSmallScreens}
          headerClassName={classes.hiddenOnSmallScreens}
        >
          <AddressField />
        </ReferenceField>
        <ReferenceField
          source="purchase_order"
          reference="purchase_orders"
          label="resources.receives.fields.purchase_order"
        >
          <TextField source="id" />
        </ReferenceField>
        <NumberField source="status" />
        <NumberField source="grand_total" />
      </Datagrid>
    </List>
  );
};

export default ReceiveList;
