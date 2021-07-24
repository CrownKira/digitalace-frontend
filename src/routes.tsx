import React from "react";
import { Route } from "react-router-dom";
import { RouteWithoutLayout } from "react-admin";
import { UserConfigEdit } from "./userMenu/configuration/UserConfig";
import { ProfileEdit } from "./userMenu/profile/Profile";
import { Register } from "./auth";

export const routes = [
  <Route key={0} exact path="/profile" component={ProfileEdit} />,
  <Route key={1} path="/configuration" component={UserConfigEdit} />,
  <RouteWithoutLayout
    key={2}
    exact
    path="/register"
    component={Register}
    noLayout
  />,
];
