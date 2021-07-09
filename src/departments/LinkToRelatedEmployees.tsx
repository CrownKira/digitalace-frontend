import { FC } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { useTranslate, FieldProps } from "react-admin";
import { stringify } from "query-string";

import employees from "../employees";
import { Department } from "../types";

const useStyles = makeStyles({
  icon: { paddingRight: "0.5em" },
  link: {
    display: "inline-flex",
    alignItems: "center",
  },
});

const LinkToRelatedEmployees: FC<FieldProps<Department>> = ({ record }) => {
  const translate = useTranslate();
  const classes = useStyles();
  return record ? (
    <Button
      size="small"
      color="primary"
      component={Link}
      to={{
        pathname: "/employees",
        search: stringify({
          filter: JSON.stringify({ designation__department: record.id }),
        }),
      }}
      className={classes.link}
    >
      <employees.icon className={classes.icon} />
      {translate("resources.departments.fields.user_set")}
    </Button>
  ) : null;
};

export default LinkToRelatedEmployees;
