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

import EmployeeLinkField from './EmployeeLinkField';
import MobileGrid from './MobileGrid';
import { ReactElement } from 'react';

const EmployeeFilter = (props: Omit<FilterProps, 'children'>) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
  </Filter>
);

const EmployeeList = (props: ListProps): ReactElement => {
  const isXsmall = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down('xs')
  );
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  return (
    <List
      {...props}
      filters={isSmall ? <EmployeeFilter /> : undefined}
      sort={{ field: '-id', order: 'DESC' }}
      perPage={25}
    >
      {isXsmall ? (
        <MobileGrid />
      ) : (
        <Datagrid optimized rowClick="edit">
          <EmployeeLinkField />
          <TextField source="first_name" />
          <TextField source="last_name" />
          <EmailField source="email" />
          <TextField
            // TODO: custom field
            source="department"
          />
        </Datagrid>
      )}
    </List>
  );
};

export default EmployeeList;

/*
TODO: roles field
<TextField
  // TODO: custom field
  source="roles"
/>
*/
