import React, { FC } from "react";
import { ReferenceInput, SelectInput, InputProps } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  input: { width: 150 },
});

interface Props extends Omit<InputProps, "source"> {
  source?: string;
}

export const DepartmentInput: FC<Props> = (props) => {
  const classes = useStyles();
  return (
    <ReferenceInput
      suggestionLimit={5}
      className={classes.input}
      reference="departments"
      source="department"
      {...props}
    >
      <SelectInput source="name" />
    </ReferenceInput>
  );
};

DepartmentInput.defaultProps = {
  source: "department",
};
