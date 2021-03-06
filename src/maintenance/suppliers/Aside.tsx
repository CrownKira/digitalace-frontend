import React, { FC } from "react";
import PropTypes from "prop-types";
import { useTranslate, Record } from "react-admin";
import { Typography, Card, CardContent, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useAsideStyles = makeStyles((theme) => ({
  root: {
    width: 400,
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));

interface AsideProps {
  record?: Record;
  basePath?: string;
}

export const Aside: FC<AsideProps> = ({ record, basePath }) => {
  const classes = useAsideStyles();
  return (
    <div className={classes.root}>
      {record && <EventList record={record} basePath={basePath} />}
    </div>
  );
};

Aside.propTypes = {
  record: PropTypes.any,
  basePath: PropTypes.string,
};

interface EventListProps {
  record?: Record;
  basePath?: string;
}

const EventList: FC<EventListProps> = () => {
  const translate = useTranslate();

  return (
    <Box m="0 0 1em 1em">
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {translate("resources.customers.fieldGroups.history")}
          </Typography>
          <Box display="flex">Coming soon...</Box>
        </CardContent>
      </Card>
    </Box>
  );
};
