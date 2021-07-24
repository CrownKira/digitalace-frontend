import React, { FC } from "react";
import { Edit, EditProps, SimpleForm, TextInput } from "react-admin";

import { requiredValidate } from "./PaymentMethodCreate";

const postDefaultValue = () => ({});

export const PaymentMethodEdit: FC<EditProps> = (props) => (
  <Edit {...props}>
    <SimpleForm warnWhenUnsavedChanges initialValues={postDefaultValue}>
      <TextInput source="name" validate={requiredValidate} />
    </SimpleForm>
  </Edit>
);
