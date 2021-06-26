// TODO: order dependencies
import { useEffect } from 'react';
import { Admin, Resource, DataProvider } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import pickBy from 'lodash/pickBy';

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

        const hasPermission = (
          codename: string,
          component: any,
          action: string
        ) => {
          switch (action) {
            case 'list':
              return userPermissions.includes(`view_${codename}`);
            case 'create':
              return userPermissions.includes(`add_${codename}`);
            case 'edit':
              return userPermissions.includes(`change_${codename}`);
            case 'codename':
              // TODO: remove codename field
              return false;
            default:
              return true;
          }
        };

        return [
          <Resource
            name="invoices"
            {...pickBy(invoices, (value, key) =>
              hasPermission('invoice', value, key)
            )}
          />,
          <Resource
            name="receives"
            {...pickBy(receives, (value, key) =>
              hasPermission('receive', value, key)
            )}
          />,
          <Resource
            name="sales_orders"
            {...pickBy(sales_orders, (value, key) =>
              hasPermission('salesorder', value, key)
            )}
          />,
          <Resource
            name="purchase_orders"
            {...pickBy(purchase_orders, (value, key) =>
              hasPermission('purchaseorder', value, key)
            )}
          />,
          <Resource
            name="products"
            {...pickBy(products, (value, key) =>
              hasPermission('product', value, key)
            )}
          />,
          <Resource
            name="customers"
            {...pickBy(customers, (value, key) =>
              hasPermission('customer', value, key)
            )}
          />,
          <Resource
            name="suppliers"
            {...pickBy(suppliers, (value, key) =>
              hasPermission('supplier', value, key)
            )}
          />,
          <Resource
            name="categories"
            {...pickBy(categories, (value, key) =>
              hasPermission('category', value, key)
            )}
          />,
          <Resource
            name="departments"
            {...pickBy(departments, (value, key) =>
              hasPermission('department', value, key)
            )}
          />,
          <Resource
            name="roles"
            {...pickBy(roles, (value, key) =>
              hasPermission('role', value, key)
            )}
          />,
          <Resource name="designations" />,
          <Resource
            name="employees"
            {...pickBy(employees, (value, key) =>
              hasPermission('user', value, key)
            )}
          />,
        ];
      }}
    </Admin>
  );
};

export default App;

/*
userPermissions.includes('view_employee') ? (
  <Resource name="employees" {...employees} />
) : null,
*/
