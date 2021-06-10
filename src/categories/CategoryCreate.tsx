import { FC } from 'react';
import {
  Create,
  CreateProps,
  SimpleForm,
  TextInput,
  ImageInput,
  ImageField,
} from 'react-admin';

const CategoryCreate: FC<CreateProps> = (props) => (
  <Create {...props}>
    <SimpleForm>
      <ImageInput
        source="image"
        accept="image/*"
        placeholder={<p>Drop your file here</p>}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
      <TextInput source="name" />
    </SimpleForm>
  </Create>
);

export default CategoryCreate;
