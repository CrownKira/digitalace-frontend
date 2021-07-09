import React, { FC } from "react";
import { Card as MuiCard, CardContent } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import { FilterLiveSearch } from "react-admin";
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

export const Aside: FC = () => (
  <Card>
    <CardContent>
      <FilterLiveSearch />
    </CardContent>
  </Card>
);
