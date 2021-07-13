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
  required,
  Record,
} from "react-admin";
import { makeStyles } from "@material-ui/core/styles";

import { Department } from "../../types";
import { formatImage } from "../../utils";
import { styles as createStyles, requiredValidate } from "./DepartmentCreate";
import { LineItemsIterator } from "../../utils/components/LineItemsIterator";

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
  // TODO: better way to add default id and user_set?
  const transform = (data: Record) => {
    (data as Department).designation_set = (data as Department).designation_set
      .filter((x) => x)
      .map((designation_data) => {
        if (!designation_data.user_set) designation_data.user_set = [];
        return designation_data;
      });
    return data;
  };

  return (
    <Edit title={<DepartmentTitle />} transform={transform} {...props}>
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
        <ArrayInput
          // TODO: set label font-size to 1.25em
          source="designation_set"
          resource="designations"
          label="resources.departments.fields.designation_set"
        >
          <LineItemsIterator resource="designations">
            <TextInput source="name" validate={requiredValidate} />
            <ReferenceArrayInput
              reference="employees"
              source="user_set"
              suggestionLimit={5}
            >
              <AutocompleteArrayInput optionText="name" />
            </ReferenceArrayInput>
          </LineItemsIterator>
        </ArrayInput>
      </SimpleForm>
    </Edit>
  );
};
