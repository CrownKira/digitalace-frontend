import {
  TextField,
  EmailField,
  Datagrid,
  Filter,
  FilterProps,
  List,
  ListProps,
  SearchInput,
} from 'react-admin';
import { useMediaQuery, Theme } from '@material-ui/core';

import SupplierLinkField from './SupplierLinkField';
import ColoredNumberField from './ColoredNumberField';
import MobileGrid from './MobileGrid';
import SupplierListAside from './SupplierListAside';
import { ReactElement } from 'react';

const SupplierFilter = (props: Omit<FilterProps, 'children'>) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
  </Filter>
);

const SupplierList = (props: ListProps): ReactElement => {
  // const classes = useStyles();
  const isXsmall = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down('xs')
  );
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  return (
    <List
      {...props}
      filters={isSmall ? <SupplierFilter /> : undefined}
      sort={{ field: 'last_seen', order: 'DESC' }}
      perPage={25}
      aside={<SupplierListAside />}
    >
      {isXsmall ? (
        <MobileGrid />
      ) : (
        <Datagrid optimized rowClick="edit">
          <SupplierLinkField />
          <TextField source="attention" />
          <EmailField source="email" />
          <TextField
            source="phone_no"
            label="resources.customers.fields.phone_no"
          />
          <ColoredNumberField
            source="payables"
            options={{ style: 'currency', currency: 'SGD' }}
          />
        </Datagrid>
      )}
    </List>
  );
};

export default SupplierList;
