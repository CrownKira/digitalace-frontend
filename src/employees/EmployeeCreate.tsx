import { FC } from 'react';
import {
  TextInput,
  PasswordInput,
  DateInput,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput,
  FileInput,
  ReferenceInput,
  ImageInput,
  FileField,
  ImageField,
  Create,
  CreateProps,
  required,
  email,
  TabbedForm,
  FormTab,
} from 'react-admin';
import { AnyObject } from 'react-final-form';
import { makeStyles } from '@material-ui/core/styles';
import { genders } from '../utils/data';
import { SectionTitle, Separator, Break } from '../utils/components';

export const styles = {
  leftFormGroup: { display: 'inline-block', marginRight: 32 },
  rightFormGroup: {
    // TODO: line break using jss
    display: 'inline-block',
  },
};

const useStyles = makeStyles(styles);

export const validatePasswords = ({
  password,
  confirm_password,
  email,
  confirm_email,
}: AnyObject) => {
  const errors = {} as any;

  if (password && confirm_password && password !== confirm_password) {
    errors.confirm_password = ['resources.employees.errors.password_mismatch'];
  }

  if (password && confirm_email && email !== confirm_email) {
    errors.confirm_email = ['resources.employees.errors.email_mismatch'];
  }

  return errors;
};

const postDefaultValue = () => ({
  image: null,
  resume: null,
});

const EmployeeCreate: FC<CreateProps> = (props) => {
  const classes = useStyles();

  return (
    <Create {...props}>
      <TabbedForm
        // TODO: make tabs scrollable
        validate={validatePasswords}
        initialValues={postDefaultValue}
      >
        <FormTab
          // qn: FormTab doesn't take input wrapped in box?
          label="resources.employees.tabs.account_login"
        >
          <Separator />
          <SectionTitle label="resources.employees.fieldGroups.avatar" />
          <ImageInput
            source="image"
            label=""
            accept="image/*"
            placeholder={<p>Drop your file here</p>}
          >
            <ImageField source="src" title="title" />
          </ImageInput>
          <Separator />
          <SectionTitle label="resources.employees.fieldGroups.account" />
          <TextInput source="name" validate={requiredValidate} />
          <TextInput
            source="first_name"
            formClassName={classes.leftFormGroup}
          />
          <TextInput
            source="last_name"
            formClassName={classes.rightFormGroup}
          />
          <Break />
          <TextInput
            type="email"
            source="email"
            formClassName={classes.leftFormGroup}
            validate={[...requiredValidate, email()]}
          />
          <TextInput
            type="email"
            source="confirm_email"
            formClassName={classes.rightFormGroup}
            validate={[...requiredValidate, email()]}
          />
          <Break />
          <PasswordInput
            source="password"
            formClassName={classes.leftFormGroup}
            validate={requiredValidate}
          />
          <PasswordInput
            source="confirm_password"
            formClassName={classes.rightFormGroup}
            validate={requiredValidate}
          />
          <Break />
        </FormTab>
        <FormTab label="resources.employees.tabs.details">
          <Separator />
          <SectionTitle label="resources.employees.fieldGroups.personal_details" />
          <TextInput
            source="nationality"
            formClassName={classes.leftFormGroup}
          />
          <TextInput source="ic_no" formClassName={classes.rightFormGroup} />
          <Break />
          <DateInput
            source="date_of_birth"
            formClassName={classes.leftFormGroup}
          />
          <SelectInput
            source="gender"
            choices={genders}
            formClassName={classes.rightFormGroup}
          />
          <Break />
          <TextInput source="phone_no" />
          <TextInput source="residential_address" multiline fullWidth />
          <TextInput source="postal_code" />
          <Separator />
          <SectionTitle label="resources.employees.fieldGroups.company_details" />
          <ReferenceInput
            source="department"
            reference="departments"
            allowEmpty
            formClassName={classes.leftFormGroup}
          >
            <SelectInput source="name" />
          </ReferenceInput>

          <ReferenceArrayInput
            // TODO: read doc on ReferenceArrayInput
            // https://marmelab.com/react-admin/Inputs.html#referencearrayinput
            source="roles"
            reference="roles"
            allowEmpty
            formClassName={classes.leftFormGroup}
          >
            <SelectArrayInput optionText="name" />
          </ReferenceArrayInput>
          <Break />
          <DateInput
            source="date_of_commencement"
            formClassName={classes.leftFormGroup}
          />
          <DateInput
            source="date_of_cessation"
            formClassName={classes.rightFormGroup}
          />
          <Break />
          <Separator />
          <SectionTitle label="resources.employees.fieldGroups.financial_details" />
          <TextInput source="basic_salary" />
          <TextInput source="total_salary" />
          <Separator />
          <SectionTitle label="resources.employees.fieldGroups.bank_account_details" />
        </FormTab>
        <FormTab label="resources.employees.tabs.documents">
          <FileInput
            source="resume"
            label="Resume"
            accept=".pdf,.png,.jpeg,.jpg,.txt"
          >
            <FileField source="src" title="title" />
          </FileInput>
        </FormTab>
      </TabbedForm>
    </Create>
  );
};

const requiredValidate = [required()];

export default EmployeeCreate;

// TODO: password field
/*
<Separator /><SectionTitle label="resources.employees.fieldGroups.password" />
<PasswordInput source="password" formClassName={classes.password} />
<PasswordInput
  source="confirm_password"
  formClassName={classes.confirm_password}
/>
*/

/*
TODO: add this back after done with api
<ReferenceInput
  source="designation"
  reference="designations"
  allowEmpty
  formClassName={classes.leftFormGroup}
>
  <SelectInput source="name" />
</ReferenceInput>
*/
