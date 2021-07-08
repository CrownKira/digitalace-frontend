// TODO: order dependencies
import { useEffect, ReactNode } from 'react';
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
import credit_notes from './credit_notes';
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
    // https://marmelab.com/react-admin/Translation.html#specific-case-in-confirm-messages-and-empty-page
    allowMissing: true,
    // https://github.com/marmelab/react-admin/issues/5727
    onMissingKey: (key: any, _: any, __: any) => key,
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
      {(userPermissions: number[]) => {
        // make sure main passes in a list of numbers
        const permissionCodeNames = userPermissions
          .map((x) => permissions.find((y) => y.id === x)?.codename)
          .filter((x) => x);

        const hasPermission = (
          codename: string,
          component: ReactNode,
          action: string
        ) => {
          switch (action) {
            case 'list':
              return permissionCodeNames.includes(`view_${codename}`);
            case 'create':
              return permissionCodeNames.includes(`add_${codename}`);
            case 'edit':
              return permissionCodeNames.includes(`change_${codename}`);
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
            // The keys are always strings. This means you can't use an object instance's identity as a key.
            {...pickBy<ReactNode>(invoices, (value, key) =>
              hasPermission('invoice', value, key)
            )}
          />,
          <Resource
            name="receives"
            {...pickBy<ReactNode>(receives, (value, key) =>
              hasPermission('receive', value, key)
            )}
          />,
          <Resource
            name="credit_notes"
            {...pickBy<ReactNode>(credit_notes, (value, key) =>
              hasPermission('creditnote', value, key)
            )}
          />,
          <Resource
            name="sales_orders"
            {...pickBy<ReactNode>(sales_orders, (value, key) =>
              hasPermission('salesorder', value, key)
            )}
          />,
          <Resource
            name="purchase_orders"
            {...pickBy<ReactNode>(purchase_orders, (value, key) =>
              hasPermission('purchaseorder', value, key)
            )}
          />,
          <Resource
            name="products"
            {...pickBy<ReactNode>(products, (value, key) =>
              hasPermission('product', value, key)
            )}
          />,
          <Resource
            name="customers"
            {...pickBy<ReactNode>(customers, (value, key) =>
              hasPermission('customer', value, key)
            )}
          />,
          <Resource
            name="suppliers"
            {...pickBy<ReactNode>(suppliers, (value, key) =>
              hasPermission('supplier', value, key)
            )}
          />,
          <Resource
            name="categories"
            {...pickBy<ReactNode>(categories, (value, key) =>
              hasPermission('productcategory', value, key)
            )}
          />,
          <Resource
            name="departments"
            {...pickBy<ReactNode>(departments, (value, key) =>
              hasPermission('department', value, key)
            )}
          />,
          <Resource
            name="roles"
            {...pickBy<ReactNode>(roles, (value, key) =>
              hasPermission('role', value, key)
            )}
          />,
          <Resource name="designations" />,
          <Resource
            name="employees"
            {...pickBy<ReactNode>(employees, (value, key) =>
              hasPermission('user', value, key)
            )}
          />,
          <Resource name="credits_applications" />,
        ];
      }}
    </Admin>
  );
};

export default App;
