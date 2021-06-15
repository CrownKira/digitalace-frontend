import {
  TextField,
  EmailField,
  Datagrid,
  Filter,
  FilterProps,
  List,
  ListProps,
  SearchInput,
  // DateInput,
  // NullableBooleanInput,
} from 'react-admin';
import { useMediaQuery, Theme } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';

// import SegmentInput from './SegmentInput';
// import EmployeeLinkField from './EmployeeLinkField';
// import ColoredNumberField from './ColoredNumberField';
import MobileGrid from './MobileGrid';
// import EmployeeListAside from './EmployeeListAside';
import { ReactElement } from 'react';

const EmployeeFilter = (props: Omit<FilterProps, 'children'>) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
  </Filter>
);

// TODO: agent input
/*
<SegmentInput />
*/

// const useStyles = makeStyles((theme) => ({
//   hiddenOnSmallScreens: {
//     display: 'table-cell',
//     [theme.breakpoints.down('md')]: {
//       display: 'none',
//     },
//   },
// }));

const EmployeeList = (props: ListProps): ReactElement => {
  // const classes = useStyles();
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
      // aside={<EmployeeListAside />}
    >
      {isXsmall ? (
        <MobileGrid />
      ) : (
        <Datagrid optimized rowClick="edit">
          <TextField
            // TODO: custom field
            source="name"
          />
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
// TODO: agent field
// https://marmelab.com/react-admin/Fields.html#referencemanyfield
<SegmentsField
cellClassName={classes.hiddenOnSmallScreens}
headerClassName={classes.hiddenOnSmallScreens}
/>
*/

/*
TODO: roles field
<TextField
  // TODO: custom field
  source="roles"
/>
*/
