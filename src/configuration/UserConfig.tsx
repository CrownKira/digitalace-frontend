import { useState, useCallback, useMemo } from "react";
import { Box, Card, CardContent, InputAdornment } from "@material-ui/core";
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
} from "react-admin";

import { SectionTitle, Separator } from "../utils/components/Divider";
import useGetUserConfig from "./useGetUserConfig";
import { ThemeSelectInput } from "./ThemeSelectInput";
import { LanguageSelectInput } from "./LanguageSelectInput";
import { UserConfig } from "../types";
import { refreshLocalStorage } from "../utils";
import { memoize } from "../utils";
import { useOnFailure } from "../utils/hooks";

export const UserConfigEdit = () => {
  useAuthenticated();

  const onFailure = useOnFailure();
  const notify = useNotify();
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const [saving, setSaving] = useState(false);
  const { loaded, data } = useGetUserConfig();

  const handleSave = useCallback(
    (values) => {
      setSaving(true);
      dataProvider
        .updateUserConfig({ data: values })
        .then(({ data: { theme, language } }: { data: UserConfig }) => {
          setSaving(false);
          refreshLocalStorage({ theme, language });
          notify("pos.user_menu.user_config.success", "info");
        })
        .catch(() => {
          setSaving(false);
          notify("pos.user_menu.user_config.failure", "warning");
        });
    },
    [dataProvider, notify]
  );

  const saveContext = useMemo(
    // useSaveContext is invoked in SaveButton.tsx
    () => ({
      save: handleSave,
      saving,
      setOnSuccess: () => {},
      setOnFailure: () => {},
      setTransform: () => {},
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

                <Title title={translate("pos.configuration")} />
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
                    <Box display={{ xs: "block", sm: "flex" }}>
                      <Box flex={1} mr={{ xs: 0, sm: "0.5em" }}>
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
                      <Box flex={1} ml={{ xs: 0, sm: "0.5em" }}>
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

const requiredValidate = required();
