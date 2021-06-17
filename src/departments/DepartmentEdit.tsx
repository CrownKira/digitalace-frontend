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

import { Department } from '../types';
import { formatImage } from '../utils';

const DepartmentTitle: FC<FieldProps<Department>> = ({ record }) => {
  const translate = useTranslate();
  return record ? (
    <span>
      {translate('resources.departments.name', { smart_count: 1 })} &quot;
      {record.name}&quot;
    </span>
  ) : null;
};

const DepartmentEdit: FC<EditProps> = (props) => (
  <Edit title={<DepartmentTitle />} {...props}>
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

export default DepartmentEdit;
