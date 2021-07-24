import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Card,
  CardContent as MuiCardContent,
  InputAdornment,
  TextField as MuiTextField,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
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
  ArrayInput,
  TextInput,
  FormDataConsumer,
  TabbedFormView,
} from "react-admin";

import { SectionTitle, Separator } from "../../utils/components/Divider";
import { useGetUserConfig } from "./useGetUserConfig";
import { ThemeSelectInput } from "./ThemeSelectInput";
import { LanguageSelectInput } from "./LanguageSelectInput";
import { UserConfig } from "../../types";
import { refreshLocalStorage } from "../../utils";
import { useOnFailure } from "../../utils/hooks";
import { TableFormIterator } from "../../utils/components/TableFormIterator";
import { FormTabWithoutLayout } from "../../utils/components/FormTabWithoutLayout";

const useStyles = makeStyles({
  leftFormGroup: { display: "inline-block", marginRight: "0.5em" },
  rightFormGroup: {
    display: "inline-block",
  },
  lineItemInput: { width: 150 },
  lineItemReferenceInput: { width: 300 },
});

const CardContent = withStyles((theme) => ({
  root: {
    padding: 0,
    "&:last-child": { padding: 0 },
  },
}))(MuiCardContent);

export const UserConfigEdit = () => {
  useAuthenticated();

  const classes = useStyles();
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
        warnWhenUnsavedChanges
        save={handleSave}
        record={data}
        render={(formProps: any) => {
          return (
            <Card>
              <CardContent>
                <TabbedFormView
                  {...formProps}
                  toolbar={
                    <Toolbar
                      // props from react-admin demo VisitorEdit
                      resource="user_configs"
                      record={formProps.record}
                      basePath={formProps.basePath}
                      invalid={formProps.invalid}
                      handleSubmit={formProps.handleSubmit}
                      saving={formProps.saving}
                      pristine={formProps.pristine}
                      // classes={{ toolbar: classes.toolbar }}
                    >
                      <SaveButton
                        // props from Toolbar.tsx
                        // TODO: disable when pristine?
                        handleSubmitWithRedirect={
                          formProps.handleSubmitWithRedirect ||
                          formProps.handleSubmit
                        }
                        disabled={formProps.disabled}
                        invalid={formProps.invalid}
                        redirect={formProps.redirect}
                        saving={formProps.saving}
                        submitOnEnter={formProps.submitOnEnter}
                        onFailure={onFailure}
                      />
                    </Toolbar>
                  }
                >
                  <FormTabWithoutLayout label="resources.user_configs.tabs.general">
                    <Box>
                      <ThemeSelectInput source="theme" />
                    </Box>
                    <Box>
                      <LanguageSelectInput source="language" />{" "}
                    </Box>
                  </FormTabWithoutLayout>
                  <FormTabWithoutLayout label="resources.user_configs.tabs.transactions">
                    <Box>
                      <TextInput
                        source="gst_rate"
                        resource="user_configs"
                        validate={requiredValidate}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Box>
                      <TextInput
                        source="discount_rate"
                        resource="user_configs"
                        validate={requiredValidate}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </FormTabWithoutLayout>
                </TabbedFormView>
              </CardContent>
            </Card>
          );
        }}
      />
    </SaveContextProvider>
  );
};

const requiredValidate = required();

/*
TODO: add payment edit
<ArrayInput
source={"payment_methods"}
resource={"payment_methods"}
>
<TableFormIterator resource={"payment_methods"}>
  <TextInput source="id" disabled />
  <TextInput
    source="name"
    className={classes.lineItemInput}
  />
</TableFormIterator>
</ArrayInput>
*/

/*
TODO: show invoices count

<FormDataConsumer label="resources.invoice_items.fields.quantity">
{({ scopedFormData }) => {
  return scopedFormData && scopedFormData.invoice_set ? (
    <MuiTextField
      value={scopedFormData.invoice_set.length}
      className={classes.lineItemInput}
      disabled
    />
  ) : null;
}}
</FormDataConsumer>
*/
