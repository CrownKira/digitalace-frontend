import { useEffect } from 'react';
import { Admin, DataProvider } from 'react-admin';

import authProvider from './authProvider';
import { Login } from './layout';

interface AppProps {
  onUnmount: () => void;
  dataProvider: DataProvider;
}

const App = ({ onUnmount, dataProvider }: AppProps) => {
  useEffect(() => onUnmount);

  return (
    <Admin
      title="DigitaLAce"
      dataProvider={dataProvider}
      // customReducers={}
      // customRoutes={}
      authProvider={authProvider}
      // dashboard={}
      loginPage={Login}
      // layout={}
      // i18nProvider={}
    ></Admin>
  );
};

export default App;
