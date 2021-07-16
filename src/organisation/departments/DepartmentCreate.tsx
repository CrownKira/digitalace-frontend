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

import { Department } from "../../types";
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

export const DepartmentCreate: FC<CreateProps> = (props) => {
  const classes = useStyles();

  const transform = (data: Record) => {
    (data as Department).designation_set = (
      data as Department
    ).designation_set.filter((x) => x);
    return data;
  };

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
          label="resources.departments.fields.designation_set"
        >
          <TableFormIterator>
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
