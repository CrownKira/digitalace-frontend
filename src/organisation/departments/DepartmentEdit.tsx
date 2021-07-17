import React, { FC } from "react";
import {
  Edit,
  EditProps,
  FieldProps,
  SimpleForm,
  TextInput,
  useTranslate,
  ImageInput,
  ImageField,
  ArrayInput,
  ReferenceArrayInput,
  AutocompleteArrayInput,
} from "react-admin";
import { makeStyles } from "@material-ui/core/styles";

import { Department } from "../../types";
import { formatImage } from "../../utils";
import {
  styles as createStyles,
  requiredValidate,
  transform,
} from "./DepartmentCreate";
import { TableFormIterator } from "../../utils/components/TableFormIterator";

const useStyles = makeStyles({
  ...createStyles,
});

const DepartmentTitle: FC<FieldProps<Department>> = ({ record }) => {
  const translate = useTranslate();
  return record ? (
    <span>
      {translate("resources.departments.name", { smart_count: 1 })} &quot;
      {record.name}&quot;
    </span>
  ) : null;
};

// TODO: add section title?
// TODO: transform to include id=-1 for new designation rows
export const DepartmentEdit: FC<EditProps> = (props) => {
  const classes = useStyles();

  return (
    <Edit title={<DepartmentTitle />} transform={transform} {...props}>
      <SimpleForm warnWhenUnsavedChanges>
        <ImageInput
          format={formatImage}
          source="image"
          accept="image/*"
          placeholder={<p>Drop your file here</p>}
        >
          <ImageField source="src" title="title" />
        </ImageInput>
        <TextInput source="name" validate={requiredValidate} />
        <ArrayInput
          // TODO: set label font-size to 1.25em
          source="designation_set"
          resource="designations"
          label="resources.departments.fields.designation_set"
        >
          <TableFormIterator
            resource="designations"
            labels={[
              "resources.employees.fields.designation",
              "resources.designations.fields.user_set",
            ]}
          >
            <TextInput source="name" validate={requiredValidate} />
            <ReferenceArrayInput
              reference="employees"
              source="user_set"
              suggestionLimit={5}
              fullWidth
            >
              <AutocompleteArrayInput optionText="name" />
            </ReferenceArrayInput>
          </TableFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Edit>
  );
};
