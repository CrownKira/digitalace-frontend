import { FC } from 'react';
import { Link, FieldProps } from 'react-admin';

import NameField from './NameField';
import { Category } from '../types';

const CategoryLinkField: FC<FieldProps<Category>> = (props) =>
  props.record ? (
    <Link to={`/categories/${props.record.id}`}>
      <NameField {...props} />
    </Link>
  ) : null;

CategoryLinkField.defaultProps = {
  source: 'name',
  addLabel: true,
};

export default CategoryLinkField;
