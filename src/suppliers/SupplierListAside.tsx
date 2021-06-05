import { FC } from 'react';
import { Card as MuiCard, CardContent } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
// import AccessTimeIcon from '@material-ui/icons/AccessTime';
// import MonetizationOnIcon from '@material-ui/icons/MonetizationOnOutlined';
// import MailIcon from '@material-ui/icons/MailOutline';
// import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import {
  // FilterList,
  FilterLiveSearch,
  // FilterListItem,
} from 'react-admin';
// import {
//   endOfYesterday,
//   startOfWeek,
//   subWeeks,
//   startOfMonth,
//   subMonths,
// } from 'date-fns';

// import segments from '../segments/data';

const Card = withStyles((theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      order: -1,
      width: '15em',
      marginRight: '1em',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}))(MuiCard);

const Aside: FC = () => (
  <Card>
    <CardContent>
      <FilterLiveSearch />
    </CardContent>
  </Card>
);

export default Aside;

// TODO: agent filter
/*
<FilterList
  label="resources.suppliers.filters.agent"
  icon={<LocalOfferIcon />}
>
  {segments.map((segment) => (
    <FilterListItem
      label={segment.name}
      key={segment.id}
      value={{ agents: segment.id }}
    />
  ))}
</FilterList>
*/

// TODO: remove after reference
/*
<FilterList
  label="resources.suppliers.filters.last_visited"
  icon={<AccessTimeIcon />}
>
  <FilterListItem
    label="resources.suppliers.filters.today"
    value={{
      last_seen_gte: endOfYesterday().toISOString(),
      last_seen_lte: undefined,
    }}
  />
  <FilterListItem
    label="resources.suppliers.filters.this_week"
    value={{
      last_seen_gte: startOfWeek(new Date()).toISOString(),
      last_seen_lte: undefined,
    }}
  />
  <FilterListItem
    label="resources.suppliers.filters.last_week"
    value={{
      last_seen_gte: subWeeks(startOfWeek(new Date()), 1).toISOString(),
      last_seen_lte: startOfWeek(new Date()).toISOString(),
    }}
  />
  <FilterListItem
    label="resources.suppliers.filters.this_month"
    value={{
      last_seen_gte: startOfMonth(new Date()).toISOString(),
      last_seen_lte: undefined,
    }}
  />
  <FilterListItem
    label="resources.suppliers.filters.last_month"
    value={{
      last_seen_gte: subMonths(startOfMonth(new Date()), 1).toISOString(),
      last_seen_lte: startOfMonth(new Date()).toISOString(),
    }}
  />
  <FilterListItem
    label="resources.suppliers.filters.earlier"
    value={{
      last_seen_gte: undefined,
      last_seen_lte: subMonths(startOfMonth(new Date()), 1).toISOString(),
    }}
  />
</FilterList>
<FilterList
  label="resources.suppliers.filters.has_ordered"
  icon={<MonetizationOnIcon />}
>
  <FilterListItem
    label="ra.boolean.true"
    value={{
      nb_commands_gte: 1,
      nb_commands_lte: undefined,
    }}
  />
  <FilterListItem
    label="ra.boolean.false"
    value={{
      nb_commands_gte: undefined,
      nb_commands_lte: 0,
    }}
  />
</FilterList>
<FilterList
  label="resources.suppliers.filters.has_newsletter"
  icon={<MailIcon />}
>
  <FilterListItem
    label="ra.boolean.true"
    value={{ has_newsletter: true }}
  />
  <FilterListItem
    label="ra.boolean.false"
    value={{ has_newsletter: false }}
  />
</FilterList>
*/
