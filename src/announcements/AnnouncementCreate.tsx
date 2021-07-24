import React, { FC } from "react";
import {
  Create,
  CreateProps,
  SimpleForm,
  TextInput,
  required,
  SelectInput,
} from "react-admin";

import { statuses, severities } from "./data";

const postDefaultValue = () => ({
  status: "DFT",
  severity: "INFO",
});

export const AnnouncementCreate: FC<CreateProps> = (props) => (
  <Create {...props}>
    <SimpleForm warnWhenUnsavedChanges initialValues={postDefaultValue}>
      <TextInput source="title" validate={requiredValidate} />
      <TextInput source="message" validate={requiredValidate} />
      <SelectInput
        source="status"
        choices={statuses}
        validate={requiredValidate}
      />
      <SelectInput
        source="severity"
        choices={severities}
        validate={requiredValidate}
      />
    </SimpleForm>
  </Create>
);

export const requiredValidate = required();
