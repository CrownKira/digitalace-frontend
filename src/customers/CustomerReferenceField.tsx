import { FC } from 'react';
import { ReferenceField, ReferenceFieldProps } from 'react-admin';

import FullNameField from './FullNameField';

const CustomerReferenceField: FC<
  Omit<ReferenceFieldProps, 'reference' | 'children' | 'source'> & {
    source?: string;
  }
> = (props) => (
  <ReferenceField source="customer" reference="customers" {...props}>
    <FullNameField />
  </ReferenceField>
);

CustomerReferenceField.defaultProps = {
  source: 'customer',
  addLabel: true,
};

export default CustomerReferenceField;
