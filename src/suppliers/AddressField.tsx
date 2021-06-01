import { FC } from 'react';
import { FieldProps } from 'react-admin';
import { Supplier } from '../types';

// copied
/// field: takes in fieldprops eg: {record:..., source:...}
/// Supplier is the record type
/// passed by the parent component
const AddressField: FC<FieldProps<Supplier>> = ({ record }) =>
  record ? (
    <span>
      {record.address}, {record.city}, {record.stateAbbr} {record.zipcode}
    </span>
  ) : null;

export default AddressField;
