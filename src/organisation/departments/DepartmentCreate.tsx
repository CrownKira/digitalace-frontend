import React, { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Create,
  CreateProps,
  SimpleForm,
  TextInput,
  ImageInput,
  ImageField,
  ArrayInput,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  required,
  Record,
} from "react-admin";

import { Department, Designation } from "../../types";
import { TableFormIterator } from "../../utils/components/TableFormIterator";

export const styles = {
  leftFormGroup: { display: "inline-block", marginRight: 32 },
  rightFormGroup: {
    display: "inline-block",
  },
};

const useStyles = makeStyles(styles);

const postDefaultValue = () => ({
  image: "",
});

export const transform = (data: Record) => {
  if (data.designation_set) {
    data.designation_set = data.designation_set.filter((x: Designation) => x);
  }
  return data;
};

export const DepartmentCreate: FC<CreateProps> = (props) => {
  const classes = useStyles();

  return (
    <Create transform={transform} {...props}>
      <SimpleForm warnWhenUnsavedChanges initialValues={postDefaultValue}>
        <ImageInput
          source="image"
          accept="image/*"
          placeholder={<p>Drop your file here</p>}
        >
          <ImageField source="src" title="title" />
        </ImageInput>
        <TextInput source="name" validate={requiredValidate} />
        <ArrayInput
          source="designation_set"
          resource="designations"
          label="resources.departments.fields.user_set"
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
    </Create>
  );
};

export const requiredValidate = required();
