import { FC } from "react";
import { Link, FieldProps } from "react-admin";

import { FullNameField } from "./FullNameField";
import { Employee } from "../../types";

export const EmployeeLinkField: FC<FieldProps<Employee>> = (props) =>
  props.record ? (
    <Link to={`/employees/${props.record.id}`}>
      <FullNameField {...props} />
    </Link>
  ) : null;

EmployeeLinkField.defaultProps = {
  // needed so dataProvider know which column this is for ordering
  source: "name",
  addLabel: true,
};
