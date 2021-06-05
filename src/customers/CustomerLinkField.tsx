import { FC } from 'react';
import { Link, FieldProps } from 'react-admin';

import FullNameField from './FullNameField';
import { Customer } from '../types';

const CustomerLinkField: FC<FieldProps<Customer>> = (props) =>
  props.record ? (
    <Link to={`/customers/${props.record.id}`}>
      <FullNameField {...props} />
    </Link>
  ) : null;

CustomerLinkField.defaultProps = {
  // TODO: need this?
  source: 'customer_id',
  addLabel: true,
};

export default CustomerLinkField;