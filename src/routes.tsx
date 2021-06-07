import { Route } from 'react-router-dom';
import Configuration from './configuration/Configuration';
import { Signup } from './auth';

export default [
  <Route exact path="/configuration" render={() => <Configuration />} />,
  <Route exact path="/signup" render={() => <Signup />} />,
];
