import { FC } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { FieldProps } from 'react-admin';
import { Supplier } from '../types';

// react-admin
interface Props extends FieldProps<Supplier> {
  className?: string;
  size?: string;
}

const AvatarField: FC<Props> = ({ record, size = '25', className }) =>
  record ? (
    <Avatar
      src={`${record.avatar}?size=${size}x${size}`}
      style={{ width: parseInt(size, 10), height: parseInt(size, 10) }}
      className={className}
    />
  ) : null;

export default AvatarField;
