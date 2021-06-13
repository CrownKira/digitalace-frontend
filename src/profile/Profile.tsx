import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import { Box, Card, CardContent, Typography } from '@material-ui/core';
import {
  TextField,
  DateField,
  ImageField,
  TextInput,
  DateInput,
  ImageInput,
  PasswordInput,
  SelectInput,
  Labeled,
  required,
  email,
  useDataProvider,
  useNotify,
  SaveContextProvider,
  useAuthenticated,
  FormWithRedirect,
  useTranslate,
  Toolbar,
  SaveButton,
} from 'react-admin';
import { AnyObject } from 'react-final-form';
import { formatImage } from '../utils';
import { genders } from '../utils/data';
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
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [saving, setSaving] = useState(false);
  const { refreshProfile } = useProfile();
  const { loaded, identity } = useGetUserProfile();
  const translate = useTranslate();

  const handleSave = useCallback(
    (values) => {
      setSaving(true);
      dataProvider
        .updateUserProfile(
          { data: values }
          // TODO: why onFailure doesn't catch error
          // {
          //   onSuccess: () => {
          //     setSaving(false);
          //     notify('pos.user_menu.profile.success', 'info');
          //     refreshProfile();
          //   },
          //   onFailure: () => {
          //     setSaving(false);
          //     notify('pos.user_menu.profile.failure', 'warning');
          //   },
          // }
        )
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
      setOnSuccess: () => void 0,
      setOnFailure: () => void 0,
      setTransform: () => void 0,
    }),
    [saving, handleSave]
  );

  if (!loaded) {
    return null;
  }

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
                <Typography variant="h6" gutterBottom>
                  {translate('resources.users.fieldGroups.avatar')}
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
                  {translate('resources.users.fieldGroups.account')}
                </Typography>

                <Box display={{ xs: 'block', sm: 'flex' }}>
                  <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <TextInput
                      source="name"
                      label="resources.users.fields.name"
                      validate={requiredValidate}
                      fullWidth
                    />
                  </Box>
                  <Box flex={2} ml={{ xs: 0, sm: '0.5em' }} />
                </Box>
                <Box display={{ xs: 'block', sm: 'flex' }}>
                  <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <TextInput
                      source="first_name"
                      label="resources.users.fields.first_name"
                      fullWidth
                    />
                  </Box>
                  <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                    <TextInput
                      source="last_name"
                      label="resources.users.fields.last_name"
                      fullWidth
                    />
                  </Box>
                </Box>
                <TextInput
                  type="email"
                  source="email"
                  validate={[...requiredValidate, email()]}
                  fullWidth
                  label="resources.users.fields.email"
                />
                <Box display={{ xs: 'block', sm: 'flex' }}>
                  <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <PasswordInput
                      source="password"
                      label="resources.users.fields.password"
                      fullWidth
                    />
                  </Box>
                  <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                    <PasswordInput
                      source="confirm_password"
                      label="resources.users.fields.confirm_password"
                      fullWidth
                    />
                  </Box>
                </Box>
                <Typography variant="h6" gutterBottom>
                  {translate('resources.users.fieldGroups.personal_details')}
                </Typography>
                <Box display={{ xs: 'block', sm: 'flex' }}>
                  <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <TextInput
                      source="nationality"
                      label="resources.users.fields.nationality"
                      fullWidth
                    />
                  </Box>
                  <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                    <TextInput
                      source="ic_no"
                      label="resources.users.fields.ic_no"
                      fullWidth
                    />
                  </Box>
                </Box>
                <Box display={{ xs: 'block', sm: 'flex' }}>
                  <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <DateInput
                      source="date_of_birth"
                      label="resources.users.fields.date_of_birth"
                      fullWidth
                    />
                  </Box>
                  <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                    <SelectInput source="gender" choices={genders} />
                  </Box>
                </Box>
                <Box display={{ xs: 'block', sm: 'flex' }}>
                  <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <TextInput
                      source="phone_no"
                      label="resources.users.fields.phone_no"
                      fullWidth
                    />
                  </Box>
                  <Box flex={2} ml={{ xs: 0, sm: '0.5em' }} />
                </Box>
                <TextInput
                  source="residential_address"
                  label="resources.users.fields.residential_address"
                  multiline
                  fullWidth
                />
                <Box display={{ xs: 'block', sm: 'flex' }}>
                  <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <TextInput
                      source="postal_code"
                      label="resources.users.fields.postal_code"
                      fullWidth
                    />
                  </Box>
                  <Box flex={2} ml={{ xs: 0, sm: '0.5em' }} />
                </Box>
                <Typography variant="h6" gutterBottom>
                  {translate('resources.users.fieldGroups.company_details')}
                </Typography>
                <Box display={{ xs: 'block', sm: 'flex' }}>
                  <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <Labeled
                      // provide the resource and source props instead of the label?
                      label="resources.users.fields.department"
                    >
                      <TextField
                        source="department"
                        // https://marmelab.com/react-admin/Fields.html
                        // https://stackoverflow.com/questions/64351273/custom-show-form-in-react-admin
                        record={identity}
                      />
                    </Labeled>
                  </Box>
                  <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                    <Labeled source="designation">
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
                        source="date_of_commencement"
                        record={identity}
                      />
                    </Labeled>
                  </Box>
                  <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                    <Labeled label="resources.users.fields.date_of_cessation">
                      <DateField source="date_of_cessation" record={identity} />
                    </Labeled>
                  </Box>
                </Box>
              </CardContent>
              <Toolbar>
                <SaveButton
                  // https://marmelab.com/react-admin/CreateEdit.html#toolbar
                  saving={formProps.saving}
                  disabled={formProps.pristine}
                  handleSubmitWithRedirect={formProps.handleSubmitWithRedirect}
                />
              </Toolbar>
            </form>
          </Card>
        )}
      />
    </SaveContextProvider>
  );
};
