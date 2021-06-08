import { FC } from 'react';
import {
  Create,
  CreateProps,
  SimpleForm,
  TextInput,
  useTranslate,
  required,
  email,
} from 'react-admin';
import { AnyObject } from 'react-final-form';
import { Typography, Box } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Styles } from '@material-ui/styles/withStyles';

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

const CustomerCreate: FC<CreateProps> = (props) => {
  const classes = useStyles(props);

  return (
    <Create {...props}>
      <SimpleForm validate={validatePasswords}>
        <SectionTitle label="resources.customers.fieldGroups.identity" />
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
        <TextInput source="business" resource="customers" />
        <TextInput source="term" resource="customers" />
      </SimpleForm>
    </Create>
  );
};

const requiredValidate = [required()];

const SectionTitle = ({ label }: { label: string }) => {
  const translate = useTranslate();

  return (
    <Typography variant="h6" gutterBottom>
      {translate(label)}
    </Typography>
  );
};

const Separator = () => <Box pt="1em" />;

export default CustomerCreate;

// TODO: password field
/*
<SectionTitle label="resources.customers.fieldGroups.password" />
<PasswordInput source="password" formClassName={classes.password} />
<PasswordInput
  source="confirm_password"
  formClassName={classes.confirm_password}
/>
*/
