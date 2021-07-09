import { FC } from "react";
import inflection from "inflection";
import { Card as MuiCard, CardContent } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import {
  FilterList,
  FilterLiveSearch,
  FilterListItem,
  useGetList,
} from "react-admin";

import { Category } from "../types";

// TODO: refactor aside (customers list, employees list)
const Card = withStyles((theme) => ({
  root: {
    [theme.breakpoints.up("sm")]: {
      order: -1,
      width: "15em",
      marginRight: "1em",
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}))(MuiCard);

const Aside: FC = () => {
  const { data, ids } = useGetList<Category>(
    "employees",
    { page: 1, perPage: 100 },
    { field: "name", order: "ASC" },
    {}
  );
  return (
    <Card>
      <CardContent>
        <FilterLiveSearch />
        <FilterList
          // TODO: filter multiple
          label="resources.customers.filters.agent"
          icon={<DirectionsWalkIcon />}
        >
          {ids &&
            data &&
            ids.map((id) => (
              <FilterListItem
                label={inflection.humanize(data[id].name)}
                key={data[id]?.id}
                value={{ agents: data[id]?.id }}
              />
            ))}
        </FilterList>
      </CardContent>
    </Card>
  );
};

export default Aside;

// TODO: agent filter
/*
<FilterList
  label="resources.customers.filters.agent"
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
  label="resources.customers.filters.last_visited"
  icon={<AccessTimeIcon />}
>
  <FilterListItem
    label="resources.customers.filters.today"
    value={{
      last_seen__gte: endOfYesterday().toISOString(),
      last_seen__lte: undefined,
    }}
  />
  <FilterListItem
    label="resources.customers.filters.this_week"
    value={{
      last_seen__gte: startOfWeek(new Date()).toISOString(),
      last_seen__lte: undefined,
    }}
  />
  <FilterListItem
    label="resources.customers.filters.last_week"
    value={{
      last_seen__gte: subWeeks(startOfWeek(new Date()), 1).toISOString(),
      last_seen__lte: startOfWeek(new Date()).toISOString(),
    }}
  />
  <FilterListItem
    label="resources.customers.filters.this_month"
    value={{
      last_seen__gte: startOfMonth(new Date()).toISOString(),
      last_seen__lte: undefined,
    }}
  />
  <FilterListItem
    label="resources.customers.filters.last_month"
    value={{
      last_seen__gte: subMonths(startOfMonth(new Date()), 1).toISOString(),
      last_seen__lte: startOfMonth(new Date()).toISOString(),
    }}
  />
  <FilterListItem
    label="resources.customers.filters.earlier"
    value={{
      last_seen__gte: undefined,
      last_seen__lte: subMonths(startOfMonth(new Date()), 1).toISOString(),
    }}
  />
</FilterList>
<FilterList
  label="resources.customers.filters.has_ordered"
  icon={<MonetizationOnIcon />}
>
  <FilterListItem
    label="ra.boolean.true"
    value={{
      nb_commands__gte: 1,
      nb_commands__lte: undefined,
    }}
  />
  <FilterListItem
    label="ra.boolean.false"
    value={{
      nb_commands__gte: undefined,
      nb_commands__lte: 0,
    }}
  />
</FilterList>
<FilterList
  label="resources.customers.filters.has_newsletter"
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
