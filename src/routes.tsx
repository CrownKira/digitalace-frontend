import { Route } from "react-router-dom";
import { RouteWithoutLayout } from "react-admin";
import { UserConfigEdit } from "./userMenu/configuration/UserConfig";
import { ProfileEdit } from "./userMenu/profile/Profile";
import { Register } from "./auth";

export const routes = [
  <Route exact path="/profile" component={ProfileEdit} />,
  <Route exact path="/configuration" component={UserConfigEdit} />,
  <RouteWithoutLayout
    exact
    path="/register"
    component={Register}
    // noLayout={true}
    noLayout
  />,
];
