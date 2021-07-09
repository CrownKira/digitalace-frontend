import { FC } from "react";
import {
  Edit,
  EditProps,
  FieldProps,
  SimpleForm,
  TextInput,
  useTranslate,
  ImageInput,
  ImageField,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  required,
} from "react-admin";

import { Role } from "../../types";
import { formatImage } from "../../utils";
import { permissions } from "../../permissions/data";

const RoleTitle: FC<FieldProps<Role>> = ({ record }) => {
  const translate = useTranslate();
  return record ? (
    <span>
      {translate("resources.roles.name", { smart_count: 1 })} &quot;
      {record.name}&quot;
    </span>
  ) : null;
};

export const RoleEdit: FC<EditProps> = (props) => (
  <Edit title={<RoleTitle />} {...props}>
    <SimpleForm>
      <ImageInput
        format={formatImage}
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
        optionText="name"
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
  </Edit>
);

const requiredValidate = required();
