import { FC } from 'react';
import { FieldProps } from 'react-admin';
import { Customer } from '../types';

// copied
/// field: takes in fieldprops eg: {record:..., source:...}
/// Customer is the record type
/// passed by the parent component
const AddressField: FC<FieldProps<Customer>> = ({ record }) =>
  record ? (
    <span>
      {record.address}, {record.city}, {record.stateAbbr} {record.zipcode}
    </span>
  ) : null;

export default AddressField;
