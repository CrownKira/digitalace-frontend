import { useEffect } from 'react';
import { Admin, Resource, DataProvider } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import authProvider from './authProvider';
import { Login, Layout } from './layout';

import { Dashboard } from './dashboard';
import englishMessages from './i18n/en';

import invoices from './invoices';
import receives from './receives';
import sales_orders from './sales_orders';
import purchase_orders from './purchase_orders';
import products from './products';
import customers from './customers';

const i18nProvider = polyglotI18nProvider((locale) => {
  return englishMessages;
}, 'en');

interface AppProps {
  onUnmount: () => void;
  dataProvider: DataProvider;
}

const App = ({ onUnmount, dataProvider }: AppProps) => {
  useEffect(() => onUnmount, [onUnmount]);

  return (
    <Admin
      title="DigitaLAce"
      dataProvider={dataProvider}
      // customReducers={}
      // customRoutes={}
      authProvider={authProvider}
      dashboard={Dashboard}
      loginPage={Login}
      layout={Layout}
      i18nProvider={i18nProvider}
      disableTelemetry
    >
      <Resource name="invoices" {...invoices} />
      <Resource name="receives" {...receives} />
      <Resource name="sales_orders" {...sales_orders} />
      <Resource name="purchase_orders" {...purchase_orders} />
      <Resource name="products" {...products} />
      <Resource name="customers" {...customers} />
    </Admin>
  );
};

export default App;
