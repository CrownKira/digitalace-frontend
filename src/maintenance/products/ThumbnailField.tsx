import React, { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FieldProps } from "react-admin";
import { Product } from "../../types";

const useStyles = makeStyles({
  root: { width: 25, maxWidth: 25, maxHeight: 25 },
});

export const ThumbnailField: FC<FieldProps<Product>> = ({ record }) => {
  const classes = useStyles();
  return record ? (
    <img src={record.thumbnail?.src} className={classes.root} alt="" />
  ) : null;
};
