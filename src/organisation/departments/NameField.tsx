import React, { FC, memo } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { FieldProps } from "react-admin";
import { AvatarField } from "./AvatarField";
import { Department } from "../../types";

// react-admin
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
  },
  avatar: {
    marginRight: theme.spacing(1),
    marginTop: -theme.spacing(0.5),
    marginBottom: -theme.spacing(0.5),
  },
}));

interface Props extends FieldProps<Department> {
  size?: string;
}

const _NameField: FC<Props> = ({ record, size }) => {
  const classes = useStyles();
  return record ? (
    <div className={classes.root}>
      <AvatarField className={classes.avatar} record={record} size={size} />
      {record.name}
    </div>
  ) : null;
};

_NameField.defaultProps = {
  source: "name",
  label: "resources.departments.fields.name",
};

export const NameField = memo<Props>(_NameField);
