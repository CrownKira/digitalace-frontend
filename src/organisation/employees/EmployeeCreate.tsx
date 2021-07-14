import React, { FC } from "react";
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
  Create,
  CreateProps,
  required,
  email,
  TabbedForm,
  FormTab,
  FormDataConsumer,
  ReferenceField,
} from "react-admin";
import { AnyObject } from "react-final-form";
import { makeStyles } from "@material-ui/core/styles";

import { genders } from "../../utils/data";
import { SectionTitle, Separator, Break } from "../../utils/components/Divider";
import { DesignationSelectInput } from "./DesignationSelectInput";
import { DepartmentSelectInput } from "./DepartmentSelectInput";

export const styles = {
  leftFormGroup: { display: "inline-block", marginRight: 32 },
  rightFormGroup: {
    // TODO: line break using jss
    display: "inline-block",
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
    errors.confirm_password = ["resources.employees.errors.password_mismatch"];
  }

  if (password && confirm_email && email !== confirm_email) {
    errors.confirm_email = ["resources.employees.errors.email_mismatch"];
  }

  return errors;
};

const postDefaultValue = () => ({
  image: "",
  resume: "",
});

export const EmployeeCreate: FC<CreateProps> = (props) => {
  const classes = useStyles();

  return (
    <Create {...props}>
      <TabbedForm
        warnWhenUnsavedChanges
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
            validate={[requiredValidate, validateEmail]}
          />
          <TextInput
            type="email"
            source="confirm_email"
            formClassName={classes.rightFormGroup}
            validate={[requiredValidate, validateEmail]}
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
    </Create>
  );
};

export const requiredValidate = required();
export const validateEmail = email();
