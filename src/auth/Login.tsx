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
  TextField,
} from "@material-ui/core";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import LockIcon from "@material-ui/icons/LockTwoTone";
import {
  Notification,
  useTranslate,
  useLogin,
  Link,
  useNotify,
} from "react-admin";

import { lightTheme } from "../layout/themes";
import { getErrorMessage } from "../utils";

export const styles = makeStyles((theme) => ({
  main: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "flex-start",
    background: "url(https://source.unsplash.com/random/1600x900)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  card: {
    minWidth: 300,
    marginTop: "6em",
  },
  avatar: {
    margin: "1em",
    display: "flex",
    justifyContent: "center",
  },
  icon: {
    backgroundColor: theme.palette.secondary.main,
  },
  hint: {
    marginTop: "1em",
    padding: "0 1em 0 1em",
    display: "flex",
    justifyContent: "center",
    color: theme.palette.grey[500],
  },
  form: {
    padding: "0 1em 1em 1em",
  },
  footer: {
    padding: "0 1em 1em 1em",
    color: theme.palette.grey[500],
  },
  input: {
    marginTop: "1em",
  },
  actions: {
    padding: "0 1em 1em 1em",
  },
}));

// TODO: refactor
export const renderInput = ({
  meta: { touched, error } = { touched: false, error: undefined },
  input: { ...inputProps },
  ...props
}) => {
  return (
    <TextField
      error={!!(touched && error)}
      helperText={touched && error}
      {...inputProps}
      {...props}
      fullWidth
    />
  );
};

interface FormValues {
  email?: string;
  password?: string;
}

const { Form } = withTypes<FormValues>();

const Login = () => {
  const [loading, setLoading] = useState(false);
  const translate = useTranslate();
  const classes = styles();
  const notify = useNotify();
  const login = useLogin();
  const location = useLocation<{ nextPathname: string } | null>();

  const handleSubmit = (auth: FormValues) => {
    setLoading(true);
    login(auth, location.state ? location.state.nextPathname : "/").catch(
      (error: Error) => {
        setLoading(false);
        // TODO: show more specific error message
        // https://marmelab.com/react-admin/CreateEdit.html#server-side-validation
        if (typeof error === "string") {
          notify(error, "warning");
        } else {
          notify(getErrorMessage(error), "warning");
        }
      }
    );
  };

  const validate = (values: FormValues) => {
    const errors: FormValues = {};
    if (!values.email) {
      errors.email = translate("ra.validation.required");
    }
    if (!values.password) {
      errors.password = translate("ra.validation.required");
    }
    return errors;
  };

  return (
    <Form
      onSubmit={handleSubmit}
      validate={validate}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} noValidate>
          <div className={classes.main}>
            <Card className={classes.card}>
              <div className={classes.avatar}>
                <Avatar className={classes.icon}>
                  <LockIcon />
                </Avatar>
              </div>
              <div className={classes.hint}>
                demo@digitalace.com / demodigitalace
              </div>
              <div className={classes.form}>
                <div className={classes.input}>
                  <Field
                    // TODO: validate email (react final form)
                    // autoFocus
                    name="email"
                    type="email"
                    // TODO: render using EmailField and PasswordField?
                    // TODO: fix warning
                    // @ts-ignore
                    component={renderInput}
                    label={translate("pos.auth.email")}
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
                  {translate("ra.auth.sign_in")}
                </Button>
              </CardActions>
              <div className={classes.footer}>
                Need an account? <Link to={`/register/`}>Sign up</Link>
              </div>
            </Card>
            <Notification />
          </div>
        </form>
      )}
    />
  );
};

Login.propTypes = {
  authProvider: PropTypes.func,
  previousRoute: PropTypes.string,
};

export const LoginWithTheme = (props: any) => (
  <ThemeProvider theme={createMuiTheme(lightTheme)}>
    <Login {...props} />
  </ThemeProvider>
);
