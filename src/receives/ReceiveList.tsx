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
  DateInput,
} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

import FullNameField from '../suppliers/FullNameField';
import AddressField from '../suppliers/AddressField';

const ListFilters = (props: Omit<FilterProps, 'children'>) => (
  <Filter {...props}>
    <DateInput source="date_gte" alwaysOn />
    <DateInput source="date_lte" alwaysOn />
  </Filter>
);

const useStyles = makeStyles((theme) => ({
  hiddenOnSmallScreens: {
    display: 'table-cell',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
}));

const InvoiceList: FC<ListProps> = (props) => {
  const classes = useStyles();
  return (
    <List
      {...props}
      filters={<ListFilters />}
      perPage={25}
      sort={{ field: 'date', order: 'desc' }}
    >
      <Datagrid rowClick="expand">
        <TextField source="id" />
        <DateField source="date" />
        <ReferenceField source="supplier_id" reference="suppliers">
          <FullNameField />
        </ReferenceField>
        <ReferenceField
          source="supplier_id"
          reference="suppliers"
          link={false}
          label="resources.receives.fields.address"
          cellClassName={classes.hiddenOnSmallScreens}
          headerClassName={classes.hiddenOnSmallScreens}
        >
          <AddressField />
        </ReferenceField>
        <ReferenceField source="command_id" reference="commands">
          <TextField source="reference" />
        </ReferenceField>
        <NumberField source="total_ex_taxes" />
        <NumberField source="delivery_fees" />
        <NumberField source="taxes" />
        <NumberField source="total" />
      </Datagrid>
    </List>
  );
};

export default InvoiceList;
