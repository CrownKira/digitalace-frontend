import { FC } from "react";
import { Link, FieldProps } from "react-admin";

import NameField from "./NameField";
import { Role } from "../../types";

const RoleLinkField: FC<FieldProps<Role>> = (props) =>
  props.record ? (
    <Link to={`/roles/${props.record.id}`}>
      <NameField {...props} />
    </Link>
  ) : null;

RoleLinkField.defaultProps = {
  source: "name",
  addLabel: true,
};

export default RoleLinkField;
