import React, { FC } from "react";
import {
  Edit,
  EditProps,
  SimpleForm,
  TextInput,
  SelectInput,
} from "react-admin";

import { requiredValidate } from "./AnnouncementCreate";
import { statuses, severities } from "./data";

export const AnnouncementEdit: FC<EditProps> = (props) => (
  <Edit {...props}>
    <SimpleForm warnWhenUnsavedChanges>
      <TextInput source="title" validate={requiredValidate} />
      <TextInput multiline source="message" validate={requiredValidate} />
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
  </Edit>
);
