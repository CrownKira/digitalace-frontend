import { FC } from 'react';
import {
  Edit,
  EditProps,
  TextInput,
  Toolbar,
  FormWithRedirect,
  required,
  email,
  FieldProps,
  ImageInput,
  ImageField,
  ReferenceArrayInput,
  AutocompleteArrayInput,
} from 'react-admin';
import { Box, Card, CardContent } from '@material-ui/core';

import Aside from './Aside';
import FullNameField from './FullNameField';
import { validatePasswords } from './CustomerCreate';
import { Customer } from '../types';
import { formatImage } from '../utils';
import { useOnFailure, useValidateUnicity } from '../utils/hooks';
import { SectionTitle, Separator } from '../utils/components/Divider';

const CustomerEdit: FC<EditProps> = (props) => {
  // TODO: make a custom type for error
  // TODO: wrap all edit and create with thisconst onFailure = useOnFailure();
  const onFailure = useOnFailure();

  return (
    <Edit
      title={<CustomerTitle />}
      aside={<Aside />}
      component="div"
      onFailure={onFailure}
      {...props}
    >
      <CustomerForm />
    </Edit>
  );
};

const CustomerTitle: FC<FieldProps<Customer>> = ({ record }) =>
  record ? <FullNameField record={record} size="32" /> : null;

// TODO: redesign layout
// TODO: split into 2 columns

const CustomerForm = (props: any) => {
  const validateReferenceUnicity = useValidateUnicity({
    reference: 'customers',
    source: 'reference',
    record: props.record,
    message: 'resources.customers.validation.reference_already_used',
  });

  return (
    <FormWithRedirect
      validate={validatePasswords}
      {...props}
      render={(formProps: any) => (
        <Card>
          <form>
            <CardContent>
              <SectionTitle label="resources.customers.fieldGroups.avatar" />
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
              <SectionTitle label="resources.customers.fieldGroups.identity" />
              <TextInput
                source="reference"
                validate={[requiredValidate, validateReferenceUnicity]}
              />
              <Box display={{ xs: 'block', sm: 'flex' }}>
                <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                  <TextInput
                    source="name"
                    /**
                     * https://marmelab.com/react-admin/CreateEdit.html#toolbar
                     * When Input components have a resource prop, they use it to
                     * determine the input label. <SimpleForm> and <TabbedForm>
                     * inject this resource prop to Input components automatically.
                     * When you use a custom form layout, pass the resource prop
                     * manually - unless the Input has a label prop.
                     */
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
                validate={validateEmail}
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
              <Separator />
              <SectionTitle label="resources.customers.fieldGroups.address" />
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
                    source="state"
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
              <Separator />
              <SectionTitle label="resources.customers.fieldGroups.other_details" />
              <Box display={{ xs: 'block', sm: 'flex' }}>
                <Box mr={{ xs: 0, sm: '0.5em' }}>
                  <TextInput source="business" resource="customers" />
                </Box>
                <Box mr={{ xs: 0, sm: '0.5em' }}>
                  <TextInput source="term" resource="customers" />
                </Box>
              </Box>
              <Separator />
              <SectionTitle label="resources.customers.fieldGroups.manage_access" />
              <ReferenceArrayInput
                resource="agents"
                reference="employees"
                source="agents"
                suggestionLimit={5}
              >
                <AutocompleteArrayInput optionText="name" />
              </ReferenceArrayInput>
            </CardContent>
            <Toolbar
              resource="customers"
              record={formProps.record}
              basePath={formProps.basePath}
              undoable={true}
              invalid={formProps.invalid}
              handleSubmit={formProps.handleSubmit}
              saving={formProps.saving}
              pristine={formProps.pristine}
            />
          </form>
        </Card>
      )}
    />
  );
};

const requiredValidate = required();
const validateEmail = email();

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
