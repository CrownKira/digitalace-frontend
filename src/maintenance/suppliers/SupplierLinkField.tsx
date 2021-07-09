import React, { FC } from "react";
import { Link, FieldProps } from "react-admin";

import { FullNameField } from "./FullNameField";
import { Supplier } from "../../types";

export const SupplierLinkField: FC<FieldProps<Supplier>> = (props) =>
  props.record ? (
    <Link to={`/suppliers/${props.record.id}`}>
      <FullNameField {...props} />
    </Link>
  ) : null;

SupplierLinkField.defaultProps = {
  source: "name",
  addLabel: true,
};
