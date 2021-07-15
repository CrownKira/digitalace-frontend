import React, { useState } from "react";
import PropTypes from "prop-types";
import { Field, withTypes } from "react-final-form";
import { useLocation } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CircularProgress,
} from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import VpnKeyIcon from "@material-ui/icons/VpnKeyTwoTone";
import {
  Notification,
  useTranslate,
  useNotify,
  useRedirect,
  Link,
} from "react-admin";

import { lightTheme } from "../layout/themes";
import { styles as loginStyles, renderInput } from "./Login";
import { getErrorMessage } from "../utils";
import { instance as main } from "../apis/main";

const register = async ({
  company_name,
  name,
  email,
  confirm_email,
  password,
  confirm_password,
}: FormValues) => {
  const response = await main.post("/api/user/create/", {
    company_name,
    name,
    email,
    confirm_email,
    password,
    confirm_password,
  });

  // TODO: remove this?
  // if (response.status < 200 || response.status >= 300) throw new Error();

  const auth = response.data;
  localStorage.setItem("auth", JSON.stringify(auth));
};

interface FormValues {
  company_name?: string;
  name?: string;
  email?: string;
  confirm_email?: string;
  password?: string;
  confirm_password?: string;
}

const { Form } = withTypes<FormValues>();

const Register = () => {
  const [loading, setLoading] = useState(false);
  const translate = useTranslate();
  const notify = useNotify();
  const classes = loginStyles();
  const location = useLocation<{ nextPathname: string } | null>();
  const redirect = useRedirect();

  const handleSubmit = (values: FormValues) => {
    setLoading(true);
    register(values)
      .then(() => redirect(location.state ? location.state.nextPathname : "/"))
      .catch((error: Error) => {
        setLoading(false);
        notify(getErrorMessage(error), "warning");
      });
  };

  const validate = (values: FormValues) => {
    const errors: FormValues = {};
    if (!values.company_name) {
      errors.company_name = translate("ra.validation.required");
    }
    if (!values.name) {
      errors.name = translate("ra.validation.required");
    }
    if (!values.email) {
      errors.email = translate("ra.validation.required");
    }
    if (!values.password) {
      errors.password = translate("ra.validation.required");
    }
    if (!values.confirm_email) {
      errors.confirm_email = translate("ra.validation.required");
    }
    if (!values.confirm_password) {
      errors.confirm_password = translate("ra.validation.required");
    }
    return errors;
  };

  return (
    <Form
      // TODO: validate confirm_email and confirm_password (refer to Profile)
      onSubmit={handleSubmit}
      validate={validate}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} noValidate>
          <div className={classes.main}>
            <Card className={classes.card}>
              <div className={classes.avatar}>
                <Avatar className={classes.icon}>
                  <VpnKeyIcon />
                </Avatar>
              </div>
              <div className={classes.hint}>
                {translate("pos.auth.register_title")}
              </div>
              <div className={classes.form}>
                <div className={classes.input}>
                  <Field
                    // autoFocus
                    name="company_name"
                    // @ts-ignore
                    component={renderInput}
                    label={translate("pos.auth.company_name")}
                    disabled={loading}
                  />
                </div>
                <div className={classes.input}>
                  <Field
                    name="name"
                    // @ts-ignore
                    component={renderInput}
                    label={translate("ra.auth.username")}
                    disabled={loading}
                  />
                </div>
                <div className={classes.input}>
                  <Field
                    // TODO: email field? (react final form)
                    name="email"
                    // TODO: fix warning
                    // @ts-ignore
                    component={renderInput}
                    label={translate("pos.auth.email")}
                    type="email"
                    disabled={loading}
                    // validate={validateReferenceUnicity}
                  />
                </div>
                <div className={classes.input}>
                  <Field
                    name="confirm_email"
                    // @ts-ignore
                    component={renderInput}
                    label={translate("pos.auth.confirm_email")}
                    type="email"
                    disabled={loading}
                  />
                </div>
                <div className={classes.input}>
                  <Field
                    name="password"
                    // @ts-ignore
                    component={renderInput}
                    label={translate("ra.auth.password")}
                    type="password"
                    disabled={loading}
                  />
                </div>
                <div className={classes.input}>
                  <Field
                    name="confirm_password"
                    // @ts-ignore
                    component={renderInput}
                    label={translate("pos.auth.confirm_password")}
                    type="password"
                    disabled={loading}
                  />
                </div>
              </div>
              <CardActions className={classes.actions}>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  disabled={loading}
                  fullWidth
                >
                  {loading && <CircularProgress size={25} thickness={2} />}
                  {translate("pos.auth.register")}
                </Button>
              </CardActions>
              <div className={classes.footer}>
                Already have an account? <Link to={`/login/`}>Sign in</Link>
              </div>
            </Card>
            <Notification />
          </div>
        </form>
      )}
    />
  );
};

Register.propTypes = {
  authProvider: PropTypes.func,
  previousRoute: PropTypes.string,
};

export const RegisterWithTheme = (props: any) => (
  <ThemeProvider theme={createMuiTheme(lightTheme)}>
    <Register {...props} />
  </ThemeProvider>
);
