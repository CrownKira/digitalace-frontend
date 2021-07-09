import { FC } from "react";
import {
  TextInput,
  PasswordInput,
  DateInput,
  SelectInput,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  FileInput,
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
  FormDataConsumer,
  ReferenceField,
} from "react-admin";
import { makeStyles } from "@material-ui/core/styles";

import { genders } from "../../utils/data";
import FullNameField from "./FullNameField";
import { styles as createStyles } from "./EmployeeCreate";
import { validatePasswords } from "./EmployeeCreate";
import { Employee } from "../../types";
import { formatImage } from "../../utils";
import { SectionTitle, Separator, Break } from "../../utils/components/Divider";
import DesignationSelectInput from "./DesignationSelectInput";
import DepartmentSelectInput from "./DepartmentSelectInput";

const useStyles = makeStyles({
  ...createStyles,
  /** edit styles go here */
});

const EmployeeTitle: FC<FieldProps<Employee>> = ({ record }) =>
  record ? <FullNameField record={record} size="32" /> : null;

const EmployeeEdit: FC<EditProps> = (props) => {
  return (
    <Edit title={<EmployeeTitle />} component="div" {...props}>
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
      validate={validatePasswords}
      {...props}
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
          validate={[requiredValidate, validateEmail]}
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
        <DepartmentSelectInput formClassName={classes.leftFormGroup} />
        <FormDataConsumer formClassName={classes.rightFormGroup}>
          {({ formData, ...rest }) => (
            <ReferenceField
              {...rest}
              source="department"
              reference="departments"
              record={formData}
              link={false}
            >
              <DesignationSelectInput />
            </ReferenceField>
          )}
        </FormDataConsumer>
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
          /**
           * https://marmelab.com/react-admin/Inputs.html#writing-your-own-input-component
           * <ReferenceArrayInput> is a stateless component,
           * so it only allows to filter the list of choices,
           * not to extend it. If you need to populate the
           * list of choices based on the result from a
           * fetch call (and if <ReferenceArrayInput> doesn’t
           * cover your need), you’ll have to write your own
           * Input component based on material-ui-chip-input.
           */
          reference="roles"
          source="roles"
          suggestionLimit={5}
        >
          <AutocompleteArrayInput optionText="name" />
        </ReferenceArrayInput>
        <ReferenceArrayInput
          reference="customers"
          source="customer_set"
          suggestionLimit={5}
        >
          <AutocompleteArrayInput optionText="name" />
        </ReferenceArrayInput>
        <ReferenceArrayInput
          reference="products"
          source="product_set"
          suggestionLimit={5}
        >
          <AutocompleteArrayInput optionText="name" />
        </ReferenceArrayInput>
      </FormTab>
    </TabbedForm>
  );
};

const requiredValidate = required();
const validateEmail = email();

export default EmployeeEdit;
