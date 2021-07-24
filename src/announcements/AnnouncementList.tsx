import React, { FC } from "react";
import { List, ListProps, SimpleList, useTranslate, Record } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";
import orange from "@material-ui/core/colors/orange";
import red from "@material-ui/core/colors/red";
import blue from "@material-ui/core/colors/blue";

import { getStatus } from "./data";

const useStyles = makeStyles({});

export const AnnouncementList: FC<ListProps> = (props) => {
  const translate = useTranslate();

  return (
    <List {...props}>
      <SimpleList
        primaryText={(record) => record.title}
        secondaryText={(record) => record.message}
        tertiaryText={(record) => translate(getStatus(record.status))}
        rowStyle={rowStyle()}
      />
    </List>
  );
};

const rowStyle = () => (record: Record) => {
  const style = {};

  if (!record) return style;

  if (record.severity === "SUCC") {
    return {
      ...style,
      borderLeftColor: green[500],
      borderLeftWidth: 5,
      borderLeftStyle: "solid",
    };
  }

  if (record.severity === "WARN") {
    return {
      ...style,
      borderLeftColor: orange[500],
      borderLeftWidth: 5,
      borderLeftStyle: "solid",
    };
  }

  if (record.severity === "INFO") {
    return {
      ...style,
      borderLeftColor: blue[500],
      borderLeftWidth: 5,
      borderLeftStyle: "solid",
    };
  }

  if (record.severity === "ERR") {
    return {
      ...style,
      borderLeftColor: red[500],
      borderLeftWidth: 5,
      borderLeftStyle: "solid",
    };
  }
};
