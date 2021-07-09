import { FC } from "react";
import { FieldProps } from "react-admin";
import { Supplier } from "../types";

// react-admin
const AddressField: FC<FieldProps<Supplier>> = ({ record }) =>
  record ? (
    <span>
      {record.address}
      {record.city ? `, ${record.city}` : ""}
      {record.state ? `, ${record.state}` : ""} {record.zipcode}
    </span>
  ) : null;

export default AddressField;
