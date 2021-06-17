import { FC } from 'react';
import {
  Edit,
  EditProps,
  FieldProps,
  SimpleForm,
  TextInput,
  useTranslate,
  ImageInput,
  ImageField,
} from 'react-admin';

import { Role } from '../types';
import { formatImage } from '../utils';

const RoleTitle: FC<FieldProps<Role>> = ({ record }) => {
  const translate = useTranslate();
  return record ? (
    <span>
      {translate('resources.roles.name', { smart_count: 1 })} &quot;
      {record.name}&quot;
    </span>
  ) : null;
};

const RoleEdit: FC<EditProps> = (props) => (
  <Edit title={<RoleTitle />} {...props}>
    <SimpleForm>
      <ImageInput
        format={formatImage}
        source="image"
        accept="image/*"
        placeholder={<p>Drop your file here</p>}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
      <TextInput source="name" />
    </SimpleForm>
  </Edit>
);

export default RoleEdit;
