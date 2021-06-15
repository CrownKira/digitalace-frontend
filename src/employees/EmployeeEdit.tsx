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
  required,
  email,
  TabbedForm,
  FormTab,
  Edit,
  EditProps,
  FieldProps,
} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

import { genders } from '../utils/data';
import FullNameField from './FullNameField';
import { styles as createStyles } from './EmployeeCreate';
import { validatePasswords } from './EmployeeCreate';
import { Employee } from '../types';
import { formatImage } from '../utils';
import { SectionTitle, Separator, Break } from '../utils/components/Divider';

const useStyles = makeStyles({
  ...createStyles,
  // comment: {
  //   maxWidth: '20em',
  //   overflow: 'hidden',
  //   textOverflow: 'ellipsis',
  //   whiteSpace: 'nowrap',
  // },
  // tab: {
  //   maxWidth: '40em',
  //   display: 'block',
  // },
});

const EmployeeTitle: FC<FieldProps<Employee>> = ({ record }) =>
  record ? <FullNameField record={record} size="32" /> : null;

const EmployeeEdit: FC<EditProps> = (props) => {
  return (
    <Edit
      title={<EmployeeTitle />}
      // aside={<Aside />}
      component="div"
      {...props}
    >
      <EmployeeForm />
    </Edit>
  );
};

// TODO: redesign layout
const EmployeeForm = (props: any) => {
  const classes = useStyles();

  return (
    <TabbedForm
      // TODO: make tabs scrollable
      {...props}
      validate={validatePasswords}
    >
      <FormTab
        // qn: FormTab doesn't take input wrapped in box?
        label="resources.employees.tabs.account_login"
      >
        <Separator />
        <SectionTitle label="resources.employees.fieldGroups.avatar" />
        <ImageInput
          format={formatImage}
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
        <TextInput source="first_name" formClassName={classes.leftFormGroup} />
        <TextInput source="last_name" formClassName={classes.rightFormGroup} />
        <Break />
        <TextInput
          type="email"
          source="email"
          validate={[...requiredValidate, email()]}
        />
        <PasswordInput
          source="password"
          formClassName={classes.leftFormGroup}
        />
        <PasswordInput
          source="confirm_password"
          formClassName={classes.rightFormGroup}
        />
        <Break />
      </FormTab>
      <FormTab label="resources.employees.tabs.details">
        <Separator />
        <SectionTitle label="resources.employees.fieldGroups.personal_details" />
        <TextInput source="nationality" formClassName={classes.leftFormGroup} />
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
        <ReferenceInput
          source="designation"
          reference="designations"
          allowEmpty
          formClassName={classes.rightFormGroup}
        >
          <SelectInput source="name" />
        </ReferenceInput>
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
      <FormTab label="resources.employees.tabs.manage_access">
        <ReferenceArrayInput
          // TODO: read doc on ReferenceArrayInput
          // https://marmelab.com/react-admin/Inputs.html#referencearrayinput
          source="roles"
          reference="roles"
          allowEmpty
        >
          <SelectArrayInput optionText="name" />
        </ReferenceArrayInput>
        <ReferenceArrayInput
          source="customer_set"
          reference="customers"
          allowEmpty
        >
          <SelectArrayInput optionText="name" />
        </ReferenceArrayInput>
        <ReferenceArrayInput
          source="product_set"
          reference="products"
          allowEmpty
        >
          <SelectArrayInput optionText="name" />
        </ReferenceArrayInput>
      </FormTab>
    </TabbedForm>
  );
};

const requiredValidate = [required()];

export default EmployeeEdit;

// TODO: password field
/*
<Typography variant="h6" gutterBottom>
  {translate(
    'resources.employees.fieldGroups.change_password'
  )}
</Typography>
<Box display={{ xs: 'block', sm: 'flex' }}>
  <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
    <PasswordInput
      source="password"
      resource="employees"
      fullWidth
    />
  </Box>

  <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
    <PasswordInput
      source="confirm_password"
      resource="employees"
      fullWidth
    />
  </Box>
</Box>
*/

// TODO: agent fields
/*
<div>
  <SegmentsInput fullWidth />
</div>
*/
