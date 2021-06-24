// TODO: order dependencies
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
import departments from './departments';
import roles from './roles';
import employees from './employees';
import invoices from './invoices';
import receives from './receives';
import sales_orders from './sales_orders';
import purchase_orders from './purchase_orders';
import customers from './customers';
import suppliers from './suppliers';
import categories from './categories';
import products from './products';
import permissions from './permissions/data';

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
      {(userPermissions) => {
        userPermissions = userPermissions
          .map((x: number) => permissions.find((y) => y.id === x)?.codename)
          .filter((x: number | undefined) => x);

        return [
          userPermissions.includes('view_invoice') ? (
            <Resource name="invoices" {...invoices} />
          ) : null,
          userPermissions.includes('view_receive') ? (
            <Resource name="receives" {...receives} />
          ) : null,
          userPermissions.includes('view_sales_order') ? (
            <Resource name="sales_orders" {...sales_orders} />
          ) : null,
          userPermissions.includes('view_purchase_order') ? (
            <Resource name="purchase_orders" {...purchase_orders} />
          ) : null,
          userPermissions.includes('view_product') ? (
            <Resource name="products" {...products} />
          ) : null,
          userPermissions.includes('view_customer') ? (
            <Resource name="customers" {...customers} />
          ) : null,
          userPermissions.includes('view_supplier') ? (
            <Resource name="suppliers" {...suppliers} />
          ) : null,
          userPermissions.includes('view_category') ? (
            <Resource name="categories" {...categories} />
          ) : null,
          userPermissions.includes('view_department') ? (
            <Resource name="departments" {...departments} />
          ) : null,
          userPermissions.includes('view_role') ? (
            <Resource name="roles" {...roles} />
          ) : null,
          userPermissions.includes('view_designation') ? (
            <Resource name="designations" />
          ) : null,
          userPermissions.includes('view_employee') ? (
            <Resource name="employees" {...employees} />
          ) : null,
        ];
      }}
    </Admin>
  );
};

export default App;
