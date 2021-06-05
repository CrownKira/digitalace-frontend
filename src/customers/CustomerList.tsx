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
import CustomerLinkField from './CustomerLinkField';
import ColoredNumberField from './ColoredNumberField';
import MobileGrid from './MobileGrid';
import CustomerListAside from './CustomerListAside';
import { ReactElement } from 'react';

const CustomerFilter = (props: Omit<FilterProps, 'children'>) => (
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

const CustomerList = (props: ListProps): ReactElement => {
  // const classes = useStyles();
  const isXsmall = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down('xs')
  );
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  return (
    <List
      {...props}
      filters={isSmall ? <CustomerFilter /> : undefined}
      sort={{ field: 'last_seen', order: 'DESC' }}
      perPage={25}
      aside={<CustomerListAside />}
    >
      {isXsmall ? (
        <MobileGrid />
      ) : (
        <Datagrid optimized rowClick="edit">
          <CustomerLinkField />
          <TextField source="attention" />
          <EmailField source="email" />
          <TextField
            source="phone_no"
            label="resources.customers.fields.phone_no"
          />
          <ColoredNumberField
            source="receivables"
            options={{ style: 'currency', currency: 'SGD' }}
          />
        </Datagrid>
      )}
    </List>
  );
};

export default CustomerList;

/*
// TODO: agent field
// https://marmelab.com/react-admin/Fields.html#referencemanyfield
<SegmentsField
cellClassName={classes.hiddenOnSmallScreens}
headerClassName={classes.hiddenOnSmallScreens}
/>
*/
