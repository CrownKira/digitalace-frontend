import React, { FC } from "react";
import { ReferenceInput, SelectInput, InputProps } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  input: { width: 150 },
});

interface Props extends Omit<InputProps, "source"> {
  source?: string;
}

export const RoleInput: FC<Props> = (props) => {
  const classes = useStyles();
  return (
    <ReferenceInput
      suggestionLimit={5}
      className={classes.input}
      reference="roles"
      source="roles"
      {...props}
    >
      <SelectInput source="name" />
    </ReferenceInput>
  );
};

RoleInput.defaultProps = {
  source: "roles",
};
