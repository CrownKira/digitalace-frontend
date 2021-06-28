import { Route } from 'react-router-dom';
import { RouteWithoutLayout } from 'react-admin';
import { UserConfigEdit } from './configuration/UserConfig';
import { ProfileEdit } from './profile/Profile';
import { Register } from './auth';

export default [
  <Route exact path="/profile" component={ProfileEdit} />,
  <Route exact path="/configuration" component={UserConfigEdit} />,
  <RouteWithoutLayout
    exact
    path="/register"
    component={Register}
    noLayout={true}
  />,
];
