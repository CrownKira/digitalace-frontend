import React, { FC } from "react";
import {
  Create,
  CreateProps,
  SimpleForm,
  TextInput,
  required,
  email,
  ImageInput,
  ImageField,
  useGetList,
  Loading,
} from "react-admin";
import { AnyObject } from "react-final-form";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Styles } from "@material-ui/styles/withStyles";

import { SectionTitle, Separator } from "../../utils/components/Divider";
import { Supplier } from "../../types";
import { incrementReference, validateUnicity } from "../../utils";
import { memoize } from "../../utils";
import { useOnFailure } from "../../utils/hooks";

export const styles: Styles<Theme, any> = {
  name: { display: "inline-block" },
  attention: { display: "inline-block", marginLeft: 32 },
  email: { width: 544 },
  address: { maxWidth: 544 },
  zipcode: { display: "inline-block" },
  city: { display: "inline-block", marginLeft: 32 },
  comment: {
    maxWidth: "20em",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};

const useStyles = makeStyles(styles);
export const validatePasswords = ({
  password,
  confirm_password,
}: AnyObject) => {
  const errors = {} as any;

  if (password && confirm_password && password !== confirm_password) {
    errors.confirm_password = ["resources.suppliers.errors.password_mismatch"];
  }

  return errors;
};

export const SupplierCreate: FC<CreateProps> = (props) => {
  const classes = useStyles(props);
  const onFailure = useOnFailure();

  const {
    data: suppliers,
    ids: supplierIds,
    loading: loadingSuppliers,
  } = useGetList<Supplier>(
    "suppliers",
    { page: 1, perPage: 1 },
    { field: "id", order: "DESC" },
    {}
  );
  const postDefaultValue = () => ({
    image: "",
    reference:
      suppliers && supplierIds.length > 0
        ? incrementReference(suppliers[supplierIds[0]].reference, "S", 4)
        : "S-0000",
  });

  return loadingSuppliers ? (
    <Loading />
  ) : (
    <Create {...props} onFailure={onFailure}>
      <SimpleForm validate={validatePasswords} initialValues={postDefaultValue}>
        <SectionTitle label="resources.suppliers.fieldGroups.avatar" />
        <ImageInput
          source="image"
          label=""
          accept="image/*"
          placeholder={<p>Drop your file here</p>}
        >
          <ImageField source="src" title="title" />
        </ImageInput>
        <SectionTitle label="resources.suppliers.fieldGroups.identity" />
        <TextInput source="reference" validate={validateReference(props)} />
        <TextInput
          autoFocus
          source="name"
          formClassName={classes.name}
          validate={requiredValidate}
        />
        <TextInput source="attention" formClassName={classes.attention} />
        <TextInput
          type="email"
          source="email"
          validation={{ email: true }}
          fullWidth
          formClassName={classes.email}
          validate={validateEmail}
        />
        <TextInput source="phone_no" />
        <Separator />
        <SectionTitle label="resources.suppliers.fieldGroups.address" />
        <TextInput
          source="address"
          formClassName={classes.address}
          multiline
          fullWidth
          helperText={false}
        />
        <TextInput
          source="zipcode"
          formClassName={classes.zipcode}
          helperText={false}
        />
        <TextInput
          source="city"
          formClassName={classes.city}
          helperText={false}
        />
      </SimpleForm>
    </Create>
  );
};

export const requiredValidate = required();
export const validateEmail = email();
export const validateReferenceUnicity = (props: any) =>
  validateUnicity({
    reference: "suppliers",
    source: "reference",
    record: props.record,
    message: "resources.suppliers.validation.reference_already_used",
  });
export const validateReference = memoize((props: any) => [
  requiredValidate,
  validateReferenceUnicity(props),
]);

// TODO: password field
/*
<SectionTitle label="resources.suppliers.fieldGroups.password" />
<PasswordInput source="password" formClassName={classes.password} />
<PasswordInput
  source="confirm_password"
  formClassName={classes.confirm_password}
/>
*/
