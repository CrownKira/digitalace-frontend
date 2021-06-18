import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
  SimpleFormIterator,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  required,
} from 'react-admin';

import { Department } from '../types';
import { formatImage } from '../utils';
import { styles as createStyles } from './DepartmentCreate';

const useStyles = makeStyles({
  ...createStyles,
});

const DepartmentTitle: FC<FieldProps<Department>> = ({ record }) => {
  const translate = useTranslate();
  return record ? (
    <span>
      {translate('resources.departments.name', { smart_count: 1 })} &quot;
      {record.name}&quot;
    </span>
  ) : null;
};

// TODO: transform to include id=-1 for new designation rows
const DepartmentEdit: FC<EditProps> = (props) => {
  const classes = useStyles();
  // TODO: better way to add default id and user_set?
  // FIXME: fix any
  const transform = (data: any) => {
    // TODO: fix any
    data.designation_set = data.designation_set
      .filter((x: any) => x)
      .map((designation_data: any) => {
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
        >
          <SimpleFormIterator>
            <TextInput
              source="name"
              formClassName={classes.leftFormGroup}
              validate={requiredValidate}
            />
            <ReferenceArrayInput
              reference="employees"
              source="user_set"
              suggestionLimit={5}
              formClassName={classes.rightFormGroup}
            >
              <AutocompleteArrayInput optionText="name" />
            </ReferenceArrayInput>
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Edit>
  );
};

const requiredValidate = [required()];

export default DepartmentEdit;
