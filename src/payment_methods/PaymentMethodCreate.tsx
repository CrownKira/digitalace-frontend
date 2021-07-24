import React, { FC } from "react";
import {
  Create,
  CreateProps,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

const postDefaultValue = () => ({});

export const PaymentMethodCreate: FC<CreateProps> = (props) => (
  <Create {...props}>
    <SimpleForm warnWhenUnsavedChanges initialValues={postDefaultValue}>
      <TextInput source="name" validate={requiredValidate} />
    </SimpleForm>
  </Create>
);

export const requiredValidate = required();
