import { FC } from 'react';
import {
  Edit,
  EditProps,
  TextInput,
  Toolbar,
  useTranslate,
  FormWithRedirect,
  required,
  email,
  FieldProps,
  ImageInput,
  ImageField,
} from 'react-admin';
import { Box, Card, CardContent, Typography } from '@material-ui/core';

import Aside from './Aside';
import FullNameField from './FullNameField';
import { validatePasswords } from './CustomerCreate';
import { Customer } from '../types';
import { formatImage } from '../utils';

const CustomerEdit: FC<EditProps> = (props) => {
  return (
    <Edit
      title={<CustomerTitle />}
      aside={<Aside />}
      component="div"
      {...props}
    >
      <CustomerForm />
    </Edit>
  );
};

const CustomerTitle: FC<FieldProps<Customer>> = ({ record }) =>
  record ? <FullNameField record={record} size="32" /> : null;

const CustomerForm = (props: any) => {
  const translate = useTranslate();

  return (
    <FormWithRedirect
      {...props}
      validate={validatePasswords}
      render={(formProps: any) => (
        <Card>
          <form>
            <CardContent>
              <Box display={{ md: 'block', lg: 'flex' }}>
                <Box flex={2} mr={{ md: 0, lg: '1em' }}>
                  <Typography variant="h6" gutterBottom>
                    {translate('resources.customers.fieldGroups.avatar')}
                  </Typography>
                  <ImageInput
                    format={formatImage}
                    source="image"
                    label=""
                    accept="image/*"
                    placeholder={<p>Drop your file here</p>}
                  >
                    <ImageField source="src" title="title" />
                  </ImageInput>
                  <Typography variant="h6" gutterBottom>
                    {translate('resources.customers.fieldGroups.identity')}
                  </Typography>
                  <Box display={{ xs: 'block', sm: 'flex' }}>
                    <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                      <TextInput
                        source="name"
                        resource="customers"
                        validate={requiredValidate}
                        fullWidth
                      />
                    </Box>
                    <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                      <TextInput
                        source="attention"
                        resource="customers"
                        fullWidth
                      />
                    </Box>
                  </Box>
                  <TextInput
                    type="email"
                    source="email"
                    resource="customers"
                    validate={[email()]}
                    fullWidth
                  />
                  <Box display={{ xs: 'block', sm: 'flex' }}>
                    <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                      <TextInput
                        source="phone_no"
                        resource="customers"
                        fullWidth
                        helperText={false}
                      />
                    </Box>
                    <Box flex={2} ml={{ xs: 0, sm: '0.5em' }} />
                  </Box>

                  <Box mt="1em" />

                  <Typography variant="h6" gutterBottom>
                    {translate('resources.customers.fieldGroups.address')}
                  </Typography>
                  <TextInput
                    source="address"
                    resource="customers"
                    multiline
                    fullWidth
                    helperText={false}
                  />
                  <Box display={{ xs: 'block', sm: 'flex' }}>
                    <Box flex={2} mr={{ xs: 0, sm: '0.5em' }}>
                      <TextInput source="city" resource="customers" fullWidth />
                    </Box>
                    <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                      <TextInput
                        source="stateAbbr"
                        resource="customers"
                        fullWidth
                        helperText={false}
                      />
                    </Box>
                    <Box flex={2}>
                      <TextInput
                        source="zipcode"
                        resource="customers"
                        fullWidth
                        helperText={false}
                      />
                    </Box>
                  </Box>

                  <Box mt="1em" />
                </Box>
                <Box
                  flex={1}
                  ml={{ xs: 0, lg: '1em' }}
                  mt={{ xs: '1em', lg: 0 }}
                >
                  <Typography variant="h6" gutterBottom>
                    {translate('resources.customers.fieldGroups.other_details')}
                  </Typography>

                  <TextInput source="business" resource="customers" />
                  <TextInput source="term" resource="customers" />
                </Box>
              </Box>
            </CardContent>
            <Toolbar
              record={formProps.record}
              basePath={formProps.basePath}
              undoable={true}
              invalid={formProps.invalid}
              handleSubmit={formProps.handleSubmit}
              saving={formProps.saving}
              resource="customers"
            />
          </form>
        </Card>
      )}
    />
  );
};

const requiredValidate = [required()];

export default CustomerEdit;

// TODO: password field
/*
<Typography variant="h6" gutterBottom>
  {translate(
    'resources.customers.fieldGroups.change_password'
  )}
</Typography>
<Box display={{ xs: 'block', sm: 'flex' }}>
  <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
    <PasswordInput
      source="password"
      resource="customers"
      fullWidth
    />
  </Box>

  <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
    <PasswordInput
      source="confirm_password"
      resource="customers"
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
