import * as React from 'react';
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

import FullNameField from '../visitors/FullNameField';
import AddressField from '../visitors/AddressField';
import InvoiceShow from './InvoiceShow';

// qn: omit?
// Construct a type with the properties of T except for those in type K.
// filter by date greater than, less than
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
      {/* show the invoice edit page on click */}
      <Datagrid rowClick="expand">
        <TextField source="id" />
        <DateField source="date" />
        <ReferenceField source="customer_id" reference="customers">
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
