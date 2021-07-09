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

import { AgentInput } from './AgentInput';
import { CustomerLinkField } from './CustomerLinkField';
import { ColoredNumberField } from './ColoredNumberField';
import { MobileGrid } from './MobileGrid';
import { CustomerListAside } from './CustomerListAside';
import { ReactElement } from 'react';

const CustomerFilter = (props: Omit<FilterProps, 'children'>) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <AgentInput />
  </Filter>
);

export const CustomerList = (props: ListProps): ReactElement => {
  const isXsmall = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down('xs')
  );
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  return (
    <List
      /**
       * after update, ra (for a brief moment) render the list using
       * the json returned by update (while waiting for getList result)
       * */
      filters={isSmall ? <CustomerFilter /> : undefined}
      sort={{ field: 'last_seen', order: 'DESC' }}
      perPage={25}
      aside={<CustomerListAside />}
      {...props}
    >
      {isXsmall ? (
        <MobileGrid />
      ) : (
        <Datagrid optimized rowClick="edit">
          <CustomerLinkField />
          <TextField source="attention" />
          <EmailField source="email" />
          <TextField source="phone_no" />
          <ColoredNumberField source="receivables" />
        </Datagrid>
      )}
    </List>
  );
};
