import {
  BooleanField,
  Datagrid,
  DateField,
  DateInput,
  Filter,
  FilterProps,
  List,
  ListProps,
  NullableBooleanInput,
  NumberField,
  SearchInput,
} from 'react-admin';
import { useMediaQuery, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import SegmentsField from './SegmentsField';
import SegmentInput from './SegmentInput';
import CustomerLinkField from './CustomerLinkField';
import ColoredNumberField from './ColoredNumberField';
import MobileGrid from './MobileGrid';
import CustomerListAside from './CustomerListAside';
import { ReactElement } from 'react';

const CustomerFilter = (props: Omit<FilterProps, 'children'>) => (
  <Filter {...props}>
    <SearchInput source="q" alwasyOn />
    <DateInput source="last_seen_gte" />
    <NullableBooleanInput source="has_ordered" />
    <NullableBooleanInput source="has_newsletter" defaultValue />
    <SegmentInput />
  </Filter>
);

const useStyles = makeStyles((theme) => ({
  nb_commands: { color: 'purple' },
  hiddenOnSmallScreens: {
    display: 'table-cell',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
}));

const CustomerList = (props: ListProps): ReactElement => {
  const classes = useStyles();
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
          <DateField source="last_seen" />
          <NumberField
            source="nb_commands"
            label="resources.customers.fields.commands"
            className={classes.nb_commands}
          />
          <ColoredNumberField
            source="total_spent"
            options={{ style: 'currency', currency: 'SGD' }}
          />
          <DateField source="latest_purchase" showTime />
          <BooleanField source="has_newsletter" label="News." />
          <SegmentsField
            // TODO: link to agent
            cellClassName={classes.hiddenOnSmallScreens}
            headerClassName={classes.hiddenOnSmallScreens}
          />
        </Datagrid>
      )}
    </List>
  );
};

export default CustomerList;
