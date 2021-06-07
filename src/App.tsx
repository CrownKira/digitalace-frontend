import { useEffect } from 'react';
import { Admin, Resource, DataProvider } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import authProvider from './authProvider';
import themeReducer from './themeReducer';
import { Layout } from './layout';
import { Login } from './auth';
import { Dashboard } from './dashboard';
import customRoutes from './routes';
import englishMessages from './i18n/en';

import invoices from './invoices';
import receives from './receives';
import sales_orders from './sales_orders';
import purchase_orders from './purchase_orders';
import products from './products';
import customers from './customers';
import suppliers from './suppliers';

const i18nProvider = polyglotI18nProvider(
  (locale) => {
    return englishMessages;
  },
  'en',
  {
    // https://github.com/marmelab/react-admin/issues/3903
    allowMissing: true,
  }
);

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
      customReducers={{ theme: themeReducer }}
      customRoutes={customRoutes}
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
      <Resource name="suppliers" {...suppliers} />
      <Resource name="categories" />
      <Resource name="reviews" />
      <Resource name="commands" />
    </Admin>
  );
};

export default App;
