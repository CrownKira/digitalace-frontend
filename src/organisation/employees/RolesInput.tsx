import React, { FC } from "react";
import {
  SelectArrayInput,
  InputProps,
  ReferenceArrayInput,
  ChipField,
} from "react-admin";

interface Props extends Omit<InputProps, "source"> {
  source: string;
}

export const RolesInput: FC<Props> = ({ addField, ...rest }) => (
  <ReferenceArrayInput reference="roles" {...rest}>
    <SelectArrayInput>
      <ChipField source="name" />
    </SelectArrayInput>
  </ReferenceArrayInput>
);

RolesInput.defaultProps = {
  addField: true,
  source: "roles",
  resource: "employees",
};
