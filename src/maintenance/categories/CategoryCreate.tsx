import React, { FC } from "react";
import {
  Create,
  CreateProps,
  SimpleForm,
  TextInput,
  ImageInput,
  ImageField,
} from "react-admin";

const postDefaultValue = () => ({
  image: "",
});

export const CategoryCreate: FC<CreateProps> = (props) => (
  <Create {...props}>
    <SimpleForm warnWhenUnsavedChanges initialValues={postDefaultValue}>
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
