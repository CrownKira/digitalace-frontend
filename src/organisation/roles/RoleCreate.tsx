import React, { FC } from "react";
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
  CheckboxGroupInput,
} from "react-admin";

import { permissions } from "../../permissions/data";

const postDefaultValue = () => ({
  image: "",
});

export const RoleCreate: FC<CreateProps> = (props) => (
  <Create {...props}>
    <SimpleForm warnWhenUnsavedChanges initialValues={postDefaultValue}>
      <ImageInput
        source="image"
        accept="image/*"
        placeholder={<p>Drop your file here</p>}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
      <TextInput source="name" validate={requiredValidate} />
      <ReferenceArrayInput
        reference="employees"
        source="user_set"
        suggestionLimit={5}
        fullWidth
      >
        <AutocompleteArrayInput optionText="name" />
      </ReferenceArrayInput>
      <CheckboxGroupInput
        source="permissions"
        choices={permissions}
        optionText="name"
        optionValue="id"
        row={false}
      />
    </SimpleForm>
  </Create>
);

export const requiredValidate = required();
