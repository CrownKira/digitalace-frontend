import React, { FC } from "react";
import { Edit, EditProps, SimpleForm, TextInput } from "react-admin";

import { requiredValidate } from "./PaymentMethodCreate";

export const PaymentMethodEdit: FC<EditProps> = (props) => (
  <Edit {...props}>
    <SimpleForm warnWhenUnsavedChanges>
      <TextInput source="name" validate={requiredValidate} />
    </SimpleForm>
  </Edit>
);
