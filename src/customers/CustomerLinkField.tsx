import { FC } from "react";
import { Link, FieldProps } from "react-admin";

import FullNameField from "./FullNameField";
import { Customer } from "../types";

const CustomerLinkField: FC<FieldProps<Customer>> = (props) =>
  props.record ? (
    <Link to={`/customers/${props.record.id}`}>
      <FullNameField {...props} />
    </Link>
  ) : null;

CustomerLinkField.defaultProps = {
  // needed so dataProvider know which column this is for ordering
  source: "name",
  addLabel: true,
};

export default CustomerLinkField;
