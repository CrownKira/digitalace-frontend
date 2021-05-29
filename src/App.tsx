import { useEffect } from 'react';
import { Admin, Resource, DataProvider } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import authProvider from './authProvider';
import { Login } from './layout';
import englishMessages from './i18n/en';

import invoices from './invoices';

const i18nProvider = polyglotI18nProvider((locale) => {
  return englishMessages;
}, 'en');

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
      i18nProvider={i18nProvider}
    >
      <Resource name="invoices" {...invoices} />
    </Admin>
  );
};

export default App;
