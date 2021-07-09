import { FC } from "react";
import { FieldProps } from "react-admin";
import { Customer } from "../../types";

// react-admin
export const AddressField: FC<FieldProps<Customer>> = ({ record }) =>
  record ? (
    <span>
      {record.address}
      {record.city ? `, ${record.city}` : ""}
      {record.state ? `, ${record.state}` : ""} {record.zipcode}
    </span>
  ) : null;
