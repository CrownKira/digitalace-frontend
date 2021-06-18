import { FC } from 'react';
import {
  Create,
  CreateProps,
  SimpleForm,
  TextInput,
  ImageInput,
  ImageField,
  required,
  AutocompleteArrayInput,
  ReferenceArrayInput,
} from 'react-admin';

import permissions from '../permissions/data';

const postDefaultValue = () => ({
  image: '',
});

const RoleCreate: FC<CreateProps> = (props) => (
  <Create {...props}>
    <SimpleForm initialValues={postDefaultValue}>
      <ImageInput
        source="image"
        accept="image/*"
        placeholder={<p>Drop your file here</p>}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
      <TextInput source="name" validate={requiredValidate} />
      <AutocompleteArrayInput
        source="permissions"
        choices={permissions}
        optionText="codename"
        optionValue="id"
      />
      <ReferenceArrayInput
        reference="employees"
        source="user_set"
        suggestionLimit={5}
      >
        <AutocompleteArrayInput optionText="name" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Create>
);

const requiredValidate = [required()];

export default RoleCreate;
