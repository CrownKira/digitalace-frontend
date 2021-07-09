import { useMediaQuery, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField,
  EmailField,
  Datagrid,
  Filter,
  FilterProps,
  List,
  ListProps,
  SearchInput,
  ReferenceField,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
} from 'react-admin';

import { DepartmentInput } from './DepartmentInput';
import { DesignationInput } from './DesignationInput';
import { RoleInput } from './RoleInput';
import { EmployeeLinkField } from './EmployeeLinkField';
import { DepartmentNameField } from '../departments/NameField';
import { MobileGrid } from './MobileGrid';
import { EmployeeListAside } from './EmployeeListAside';
import { ReactElement } from 'react';

const useStyles = makeStyles((theme) => ({
  nb_commands: { color: 'purple' },
  hiddenOnSmallScreens: {
    display: 'table-cell',

    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
}));

const EmployeeFilter = (props: Omit<FilterProps, 'children'>) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <DepartmentInput source="department" />
    <DesignationInput source="designation" />
    <RoleInput source="roles" />
  </Filter>
);

export const EmployeeList = (props: ListProps): ReactElement => {
  const classes = useStyles();
  const isXsmall = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down('xs')
  );
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  return (
    <List
      filters={isSmall ? <EmployeeFilter /> : undefined}
      sort={{ field: '-id', order: 'DESC' }}
      perPage={25}
      aside={<EmployeeListAside />}
      {...props}
    >
      {isXsmall ? (
        <MobileGrid />
      ) : (
        <Datagrid optimized rowClick="edit">
          <EmployeeLinkField />
          <TextField source="first_name" />
          <TextField source="last_name" />
          <EmailField source="email" />
          <ReferenceField source="department" reference="departments">
            <DepartmentNameField />
          </ReferenceField>
          <ReferenceArrayField
            cellClassName={classes.hiddenOnSmallScreens}
            headerClassName={classes.hiddenOnSmallScreens}
            reference="roles"
            source="roles"
          >
            <SingleFieldList>
              <ChipField source="name" />
            </SingleFieldList>
          </ReferenceArrayField>
        </Datagrid>
      )}
    </List>
  );
};
