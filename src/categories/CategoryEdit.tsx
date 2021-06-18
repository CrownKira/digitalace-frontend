import { FC } from 'react';
import {
  Datagrid,
  Edit,
  EditProps,
  EditButton,
  FieldProps,
  NumberField,
  TextField,
  ReferenceField,
  ReferenceManyField,
  SimpleForm,
  TextInput,
  useTranslate,
  ImageInput,
  ImageField,
} from 'react-admin';

import ThumbnailField from '../products/ThumbnailField';
import ProductRefField from '../products/ProductRefField';
import { Category } from '../types';
import FullNameField from '../suppliers/FullNameField';
import { formatImage } from '../utils';

const CategoryTitle: FC<FieldProps<Category>> = ({ record }) => {
  const translate = useTranslate();
  return record ? (
    <span>
      {translate('resources.categories.name', { smart_count: 1 })} &quot;
      {record.name}&quot;
    </span>
  ) : null;
};

const CategoryEdit: FC<EditProps> = (props) => (
  <Edit title={<CategoryTitle />} {...props}>
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
      <ReferenceManyField
        reference="products"
        target="category"
        label="resources.categories.fields.product_set"
        perPage={20}
        fullWidth
      >
        <Datagrid>
          <ThumbnailField />
          <ProductRefField source="name" />
          <TextField source="unit" />
          <NumberField
            source="cost"
            options={{ style: 'currency', currency: 'SGD' }}
          />
          <NumberField
            source="unit_price"
            options={{ style: 'currency', currency: 'SGD' }}
          />
          <NumberField source="stock" />
          <NumberField source="sales" />
          <ReferenceField source="supplier" reference="suppliers">
            <FullNameField />
          </ReferenceField>
          <EditButton />
        </Datagrid>
      </ReferenceManyField>
    </SimpleForm>
  </Edit>
);

export default CategoryEdit;
