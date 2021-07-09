import { FC } from "react";
import { Link, FieldProps } from "react-admin";

import { NameField } from "./NameField";
import { Department } from "../../types";

export const DepartmentLinkField: FC<FieldProps<Department>> = (props) =>
  props.record ? (
    <Link to={`/departments/${props.record.id}`}>
      <NameField {...props} />
    </Link>
  ) : null;

DepartmentLinkField.defaultProps = {
  source: "name",
  addLabel: true,
};
