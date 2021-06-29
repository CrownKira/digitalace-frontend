import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import { Box, Card, CardContent } from '@material-ui/core';
import {
  TextField,
  DateField,
  ImageField,
  TextInput,
  DateInput,
  ImageInput,
  PasswordInput,
  SelectInput,
  ReferenceInput,
  Labeled,
  required,
  email,
  useDataProvider,
  useNotify,
  SaveContextProvider,
  useAuthenticated,
  FormWithRedirect,
  Toolbar,
  SaveButton,
  useRefresh,
} from 'react-admin';
import { AnyObject } from 'react-final-form';
import { formatImage, getFieldError } from '../utils';
import { genders } from '../utils/data';
import { SectionTitle, Separator } from '../utils/components/Divider';
import useGetUserProfile from './useGetUserProfile';

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

const requiredValidate = [required()];

export interface ProfileContextValue {
  profileVersion: number;
  refreshProfile: () => void;
}

// https://stackoverflow.com/questions/61333188/react-typescript-avoid-context-default-value
const ProfileContext = createContext<ProfileContextValue>(
  {} as ProfileContextValue
);

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profileVersion, setProfileVersion] = useState(0);
  const context = useMemo(
    () => ({
      profileVersion,
      refreshProfile: () =>
        setProfileVersion((currentVersion) => currentVersion + 1),
    }),
    [profileVersion]
  );

  return (
    <ProfileContext.Provider value={context}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);

export const ProfileEdit = () => {
  useAuthenticated();
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();
  const [saving, setSaving] = useState(false);
  const { loaded, identity } = useGetUserProfile();
  const { refreshProfile } = useProfile();

  // TODO: remove permission on submit
  const handleSave = useCallback(
    (values) => {
      setSaving(true);
      dataProvider
        .updateUserProfile({ data: values })
        .then(() => {
          setSaving(false);
          notify('pos.user_menu.profile.success', 'info');
          refreshProfile();
        })
        .catch(() => {
          setSaving(false);
          notify('pos.user_menu.profile.failure', 'warning');
        });
    },
    [dataProvider, notify, refreshProfile]
  );

  const saveContext = useMemo(
    // useSaveContext is invoked in SaveButton.tsx
    () => ({
      save: handleSave,
      saving,
      // FIXME: write implementations
      setOnSuccess: () => {},
      setOnFailure: () => {},
      setTransform: () => {},
    }),
    [saving, handleSave]
  );

  if (!loaded) {
    return null;
  }

  const onFailure = (error: any) => {
    notify(
      typeof error === 'string'
        ? error
        : getFieldError(error) || 'ra.notification.http_error',
      'warning'
    );

    refresh();
  };

  // TODO: add aside
  // TODO: use react-final-form <Form> component?
  // TODO: find better way to construct a custom form
  // (since there is no redirect)
  // https://github.com/marmelab/react-admin/issues/5563
  // TODO: wrap in MuiCard
  return (
    <SaveContextProvider value={saveContext}>
      <FormWithRedirect
        save={handleSave}
        validate={validatePasswords}
        record={identity}
        render={(formProps: any) => (
          <Card>
            <form>
              <CardContent>
                <SectionTitle label="resources.users.fieldGroups.avatar" />
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
                <SectionTitle label="resources.users.fieldGroups.account" />
                <Box display={{ xs: 'block', sm: 'flex' }}>
                  <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <TextInput
                      source="name"
                      // TODO: use resource instead of label?
                      resource="users"
                      validate={requiredValidate}
                      fullWidth
                    />
                  </Box>
                  <Box flex={2} ml={{ xs: 0, sm: '0.5em' }} />
                </Box>
                <Box display={{ xs: 'block', sm: 'flex' }}>
                  <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <TextInput source="first_name" resource="users" fullWidth />
                  </Box>
                  <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                    <TextInput source="last_name" resource="users" fullWidth />
                  </Box>
                </Box>
                <TextInput
                  type="email"
                  source="email"
                  validate={[...requiredValidate, email()]}
                  fullWidth
                  resource="users"
                />
                <Box display={{ xs: 'block', sm: 'flex' }}>
                  <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <PasswordInput
                      source="password"
                      resource="users"
                      fullWidth
                    />
                  </Box>
                  <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                    <PasswordInput
                      source="confirm_password"
                      resource="users"
                      fullWidth
                    />
                  </Box>
                </Box>
                <Separator />
                <SectionTitle label="resources.users.fieldGroups.personal_details" />
                <Box display={{ xs: 'block', sm: 'flex' }}>
                  <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <TextInput
                      source="nationality"
                      resource="users"
                      fullWidth
                    />
                  </Box>
                  <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                    <TextInput source="ic_no" resource="users" fullWidth />
                  </Box>
                </Box>
                <Box display={{ xs: 'block', sm: 'flex' }}>
                  <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <DateInput
                      source="date_of_birth"
                      resource="users"
                      fullWidth
                    />
                  </Box>
                  <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                    <SelectInput source="gender" choices={genders} />
                  </Box>
                </Box>
                <Box display={{ xs: 'block', sm: 'flex' }}>
                  <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <TextInput source="phone_no" resource="users" fullWidth />
                  </Box>
                  <Box flex={2} ml={{ xs: 0, sm: '0.5em' }} />
                </Box>
                <TextInput
                  source="residential_address"
                  resource="users"
                  multiline
                  fullWidth
                />
                <Box display={{ xs: 'block', sm: 'flex' }}>
                  <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <TextInput
                      source="postal_code"
                      resource="users"
                      fullWidth
                    />
                  </Box>
                  <Box flex={2} ml={{ xs: 0, sm: '0.5em' }} />
                </Box>
                <Separator />
                <SectionTitle label="resources.users.fieldGroups.company_details" />
                <Box display={{ xs: 'block', sm: 'flex' }}>
                  <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <TextInput
                      source="company_name"
                      resource="users"
                      validate={requiredValidate}
                      fullWidth
                      disabled={!identity?.is_staff}
                    />
                  </Box>
                  <Box flex={2} ml={{ xs: 0, sm: '0.5em' }} />
                </Box>
                {!identity?.is_staff && (
                  <>
                    <Box display={{ xs: 'block', sm: 'flex' }}>
                      <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                        <Labeled
                          // TODO: provide the resource and source props instead of the label?
                          label="resources.users.fields.department"
                        >
                          <ReferenceInput
                            record={identity}
                            source="department"
                            reference="departments"
                            validate={requiredValidate}
                          >
                            <SelectInput source="name" />
                          </ReferenceInput>
                        </Labeled>
                      </Box>
                      <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                        <Labeled label="resources.users.fields.designation">
                          <TextField source="designation" record={identity} />
                        </Labeled>
                      </Box>
                    </Box>
                    <Box display={{ xs: 'block', sm: 'flex' }}>
                      <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                        <Labeled label="resources.users.fields.role">
                          <TextField source="role" record={identity} />
                        </Labeled>
                      </Box>
                      <Box flex={2} ml={{ xs: 0, sm: '0.5em' }} />
                    </Box>
                    <Box display={{ xs: 'block', sm: 'flex' }}>
                      <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                        <Labeled label="resources.users.fields.date_of_commencement">
                          <DateField
                            // https://marmelab.com/react-admin/Fields.html
                            // https://stackoverflow.com/questions/64351273/custom-show-form-in-react-admin
                            source="date_of_commencement"
                            record={identity}
                          />
                        </Labeled>
                      </Box>
                      <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                        <Labeled label="resources.users.fields.date_of_cessation">
                          <DateField
                            source="date_of_cessation"
                            record={identity}
                          />
                        </Labeled>
                      </Box>
                    </Box>
                  </>
                )}
              </CardContent>

              <Toolbar
                // props from react-admin demo VisitorEdit
                resource="user_configs"
                record={formProps.record}
                basePath={formProps.basePath}
                undoable={true}
                invalid={formProps.invalid}
                handleSubmit={formProps.handleSubmit}
                saving={formProps.saving}
                pristine={formProps.pristine}
              >
                <SaveButton
                  // props from Toolbar.tsx
                  handleSubmitWithRedirect={
                    formProps.handleSubmitWithRedirect || formProps.handleSubmit
                  }
                  disabled={formProps.disabled}
                  invalid={formProps.invalid}
                  redirect={formProps.redirect}
                  saving={formProps.saving}
                  submitOnEnter={formProps.submitOnEnter}
                  onFailure={onFailure}
                />
              </Toolbar>
            </form>
          </Card>
        )}
      />
    </SaveContextProvider>
  );
};
