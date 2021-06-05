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

/*
// TODO: agent field
// https://marmelab.com/react-admin/Fields.html#referencemanyfield
<SegmentsField
cellClassName={classes.hiddenOnSmallScreens}
headerClassName={classes.hiddenOnSmallScreens}
/>
*/
