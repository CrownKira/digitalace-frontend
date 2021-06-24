import { useState, useCallback, useMemo } from 'react';
import { Box, Card, CardContent, InputAdornment } from '@material-ui/core';
import {
  TextInput,
  required,
  useDataProvider,
  useNotify,
  SaveContextProvider,
  useAuthenticated,
  FormWithRedirect,
  Toolbar,
  SaveButton,
  useTranslate,
  Title,
} from 'react-admin';

import { SectionTitle, Separator } from '../utils/components/Divider';
import useGetUserConfig from './useGetUserConfig';
import { ThemeSelectInput } from './ThemeSelectInput';
import { LanguageSelectInput } from './LanguageSelectInput';

export const UserConfig = () => {
  useAuthenticated();
  const notify = useNotify();
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const [saving, setSaving] = useState(false);
  const { loaded, data } = useGetUserConfig();

  // TODO: remove permission on submit
  const handleSave = useCallback(
    (values) => {
      setSaving(true);
      dataProvider
        .updateUserConfig({ data: values })
        .then(() => {
          setSaving(false);
          notify('pos.user_menu.profile.success', 'info');
        })
        .catch(() => {
          setSaving(false);
          notify('pos.user_menu.profile.failure', 'warning');
        });
    },
    [dataProvider, notify]
  );

  const saveContext = useMemo(
    // useSaveContext is invoked in SaveButton.tsx
    () => ({
      save: handleSave,
      saving,

      setOnSuccess: () => void 0,
      setOnFailure: () => void 0,
      setTransform: () => void 0,
    }),
    [saving, handleSave]
  );

  if (!loaded) {
    return null;
  }

  return (
    <SaveContextProvider value={saveContext}>
      <FormWithRedirect
        save={handleSave}
        record={data}
        render={(formProps: any) => (
          <Card>
            <form>
              <CardContent>
                <SectionTitle label="resources.user_configs.fieldGroups.general" />

                <Title title={translate('pos.configuration')} />
                <Card>
                  <CardContent>
                    <ThemeSelectInput source="theme" />
                  </CardContent>
                  <CardContent>
                    <LanguageSelectInput source="language" />
                  </CardContent>
                </Card>
                <Separator />
                <SectionTitle label="resources.user_configs.fieldGroups.transactions" />
                <Card>
                  <CardContent>
                    <Box display={{ xs: 'block', sm: 'flex' }}>
                      <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                        <TextInput
                          source="gst_rate"
                          resource="user_configs"
                          fullWidth
                          validate={requiredValidate}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                      <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                        <TextInput
                          source="discount_rate"
                          resource="user_configs"
                          fullWidth
                          validate={requiredValidate}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </CardContent>
              <Toolbar>
                <SaveButton
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

const requiredValidate = [required()];
