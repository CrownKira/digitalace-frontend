import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Create,
  CreateProps,
  SimpleForm,
  TextInput,
  ImageInput,
  ImageField,
  ArrayInput,
  SimpleFormIterator,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  required,
} from 'react-admin';

export const styles = {
  leftFormGroup: { display: 'inline-block', marginRight: 32 },
  rightFormGroup: {
    display: 'inline-block',
  },
};

const useStyles = makeStyles(styles);

const postDefaultValue = () => ({
  image: '',
});

const DepartmentCreate: FC<CreateProps> = (props) => {
  const classes = useStyles();

  const transform = (data: any) => {
    data.designation_set = data.designation_set.filter((x: any) => x);
    return data;
  };

  return (
    <Create transform={transform} {...props}>
      <SimpleForm initialValues={postDefaultValue}>
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
    </Create>
  );
};

const requiredValidate = [required()];

export default DepartmentCreate;
