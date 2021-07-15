import React, { FC } from "react";
import inflection from "inflection";
import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LocalOfferIcon from "@material-ui/icons/LocalOfferTwoTone";
import BarChartIcon from "@material-ui/icons/BarChartTwoTone";
import AttachMoneyIcon from "@material-ui/icons/AttachMoneyTwoTone";
import {
  FilterList,
  FilterListItem,
  FilterLiveSearch,
  useGetList,
} from "react-admin";

import { Category } from "../../types";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up("sm")]: {
      width: "15em",
      marginRight: "1em",
      overflow: "initial",
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

export const Aside: FC = () => {
  const { data, ids } = useGetList<Category>(
    "categories",
    { page: 1, perPage: 100 },
    { field: "name", order: "ASC" },
    {}
  );
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <FilterLiveSearch />
        <FilterList
          label="resources.products.filters.sales"
          icon={<AttachMoneyIcon />}
        >
          <FilterListItem
            label="resources.products.filters.best_sellers"
            value={{
              sales__lte: undefined,
              sales__gt: 25,
              sales: undefined,
            }}
          />
          <FilterListItem
            label="resources.products.filters.average_sellers"
            value={{
              sales__lte: 25,
              sales__gt: 10,
              sales: undefined,
            }}
          />
          <FilterListItem
            label="resources.products.filters.low_sellers"
            value={{
              sales__lte: 10,
              sales__gt: 0,
              sales: undefined,
            }}
          />
          <FilterListItem
            label="resources.products.filters.never_sold"
            value={{
              sales__lte: undefined,
              sales__gt: undefined,
              sales: 0,
            }}
          />
        </FilterList>
        <FilterList
          label="resources.products.filters.stock"
          icon={<BarChartIcon />}
        >
          <FilterListItem
            label="resources.products.filters.no_stock"
            value={{
              stock__lt: undefined,
              stock__gt: undefined,
              stock: 0,
            }}
          />
          <FilterListItem
            label="resources.products.filters.low_stock"
            value={{
              stock__lt: 10,
              stock__gt: 0,
              stock: undefined,
            }}
          />
          <FilterListItem
            label="resources.products.filters.average_stock"
            value={{
              stock__lt: 50,
              stock__gt: 9,
              stock: undefined,
            }}
          />
          <FilterListItem
            label="resources.products.filters.enough_stock"
            value={{
              stock__lt: undefined,
              stock__gt: 49,
              stock: undefined,
            }}
          />
        </FilterList>
        <FilterList
          label="resources.products.filters.categories"
          icon={<LocalOfferIcon />}
        >
          {ids &&
            data &&
            ids.map((id) => (
              <FilterListItem
                label={inflection.humanize(data[id].name)}
                key={data[id]?.id}
                value={{ category: data[id]?.id }}
              />
            ))}
        </FilterList>
      </CardContent>
    </Card>
  );
};
