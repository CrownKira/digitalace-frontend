import { FC } from 'react';
import { Link } from 'react-router-dom';
import { FieldProps } from 'react-admin';
import { Product } from '../../types';

export const ProductRefField: FC<FieldProps<Product>> = ({ record }) =>
  record ? <Link to={`/products/${record.id}`}>{record.name} </Link> : null;

ProductRefField.defaultProps = {
  source: 'name',
  label: 'Name',
};
