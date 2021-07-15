import React, { FC } from "react";
import inflection from "inflection";
import { Card as MuiCard, CardContent } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalkTwoTone";
import {
  FilterList,
  FilterLiveSearch,
  FilterListItem,
  useGetList,
} from "react-admin";

import { Category } from "../../types";

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

export const Aside: FC = () => {
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
