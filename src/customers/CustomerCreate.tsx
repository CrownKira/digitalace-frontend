import { FC } from 'react';
import {
  Create,
  CreateProps,
  SimpleForm,
  TextInput,
  required,
  email,
  ImageInput,
  ImageField,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  useGetList,
  Loading,
  useNotify,
  useRefresh,
} from 'react-admin';
import { AnyObject } from 'react-final-form';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Styles } from '@material-ui/styles/withStyles';

import { SectionTitle, Separator } from '../utils/components/Divider';
import { Customer } from '../types';
import { incrementReference, getFieldError } from '../utils';

export const styles: Styles<Theme, any> = {
  name: { display: 'inline-block' },
  attention: { display: 'inline-block', marginLeft: 32 },
  email: { width: 544 },
  address: { maxWidth: 544 },
  zipcode: { display: 'inline-block' },
  city: { display: 'inline-block', marginLeft: 32 },
  comment: {
    maxWidth: '20em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};

const useStyles = makeStyles(styles);

export const validatePasswords = ({
  password,
  confirm_password,
}: AnyObject) => {
  const errors = {} as any;

  if (password && confirm_password && password !== confirm_password) {
    errors.confirm_password = ['resources.customers.errors.password_mismatch'];
  }

  return errors;
};

/**
 * provide defaults for non-string and non-integer inputs
 * these fields if left empty, will get rejected by drf serializer
 */

const CustomerCreate: FC<CreateProps> = (props) => {
  // qn: why need props?
  const classes = useStyles(props);
  const {
    data: customers,
    ids: customerIds,
    loading: loadingCustomers,
  } = useGetList<Customer>(
    'customers',
    { page: 1, perPage: 1 },
    { field: 'id', order: 'DESC' },
    {}
  );
  const postDefaultValue = () => ({
    image: '',
    reference:
      customers && customerIds.length > 0
        ? incrementReference(customers[customerIds[0]].reference, 'C', 4)
        : 'C-0000',
  });

  const notify = useNotify();
  const refresh = useRefresh();

  // TODO: make a custom type for error
  const onFailure = (error: any) => {
    notify(
      typeof error === 'string'
        ? error
        : getFieldError(error) || 'ra.notification.http_error',
      'warning'
    );

    refresh();
  };

  return loadingCustomers ? (
    <Loading />
  ) : (
    <Create {...props} onFailure={onFailure}>
      <SimpleForm validate={validatePasswords} initialValues={postDefaultValue}>
        <SectionTitle label="resources.customers.fieldGroups.avatar" />
        <ImageInput
          source="image"
          label=""
          accept="image/*"
          placeholder={<p>Drop your file here</p>}
        >
          <ImageField source="src" title="title" />
        </ImageInput>
        <SectionTitle label="resources.customers.fieldGroups.identity" />
        <TextInput source="reference" validate={requiredValidate} />
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
          validate={[email()]}
        />
        <TextInput source="phone_no" />
        <Separator />
        <SectionTitle label="resources.customers.fieldGroups.address" />
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
        <Separator />
        <SectionTitle label="resources.customers.fieldGroups.other_details" />
        <TextInput source="business" />
        <TextInput source="term" />
        <Separator />
        <SectionTitle label="resources.customers.fieldGroups.manage_access" />
        <ReferenceArrayInput
          reference="employees"
          source="agents"
          suggestionLimit={5}
        >
          <AutocompleteArrayInput optionText="name" />
        </ReferenceArrayInput>
      </SimpleForm>
    </Create>
  );
};

const requiredValidate = [required()];

export default CustomerCreate;

// TODO: implement password inputs after customer account is set up
/*
<SectionTitle label="resources.customers.fieldGroups.password" />
<PasswordInput source="password" formClassName={classes.password} />
<PasswordInput
  source="confirm_password"
  formClassName={classes.confirm_password}
/>
*/
