// TODO: order dependencies
import React, { useEffect, ReactNode } from "react";
import { Admin, Resource, DataProvider } from "react-admin";
import polyglotI18nProvider from "ra-i18n-polyglot";
import pickBy from "lodash/pickBy";

import { authProvider } from "./authProvider";
import { themeReducer } from "./themeReducer";
import { Layout } from "./layout";
import { Login } from "./auth";
import { Dashboard } from "./dashboard";
import { routes as customRoutes } from "./routes";
import { customEnglishMessages as englishMessages } from "./i18n/en";
import { departments } from "./organisation/departments";
import { roles } from "./organisation/roles";
import { employees } from "./organisation/employees";
import { invoices } from "./transactions/invoices";
import { receives } from "./transactions/receives";
import { credit_notes } from "./transactions/credit_notes";
import { sales_orders } from "./transactions/sales_orders";
import { purchase_orders } from "./transactions/purchase_orders";
import { customers } from "./maintenance/customers";
import { suppliers } from "./maintenance/suppliers";
import { categories } from "./maintenance/categories";
import { products } from "./maintenance/products";
import { permissions } from "./permissions/data";

// rafc
const i18nProvider = polyglotI18nProvider(
  (locale) => {
    return englishMessages;
  },
  "en",
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

export const App = ({ onUnmount, dataProvider }: AppProps) => {
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
            case "list":
              return permissionCodeNames.includes(`view_${codename}`);
            case "create":
              return permissionCodeNames.includes(`add_${codename}`);
            case "edit":
              return permissionCodeNames.includes(`change_${codename}`);
            case "codename":
              // TODO: remove codename field
              return false;
            default:
              return true;
          }
        };

        return [
          <Resource
            key="invoices"
            name="invoices"
            // The keys are always strings. This means you can't use an object instance's identity as a key.
            {...pickBy<ReactNode>(invoices, (value, key) =>
              hasPermission("invoice", value, key)
            )}
          />,
          <Resource
            key="receives"
            name="receives"
            {...pickBy<ReactNode>(receives, (value, key) =>
              hasPermission("receive", value, key)
            )}
          />,
          <Resource
            key="credit_notes"
            name="credit_notes"
            {...pickBy<ReactNode>(credit_notes, (value, key) =>
              hasPermission("creditnote", value, key)
            )}
          />,
          <Resource
            key="sales_orders"
            name="sales_orders"
            {...pickBy<ReactNode>(sales_orders, (value, key) =>
              hasPermission("salesorder", value, key)
            )}
          />,
          <Resource
            key="purchase_orders"
            name="purchase_orders"
            {...pickBy<ReactNode>(purchase_orders, (value, key) =>
              hasPermission("purchaseorder", value, key)
            )}
          />,
          <Resource
            key="products"
            name="products"
            {...pickBy<ReactNode>(products, (value, key) =>
              hasPermission("product", value, key)
            )}
          />,
          <Resource
            key="customers"
            name="customers"
            {...pickBy<ReactNode>(customers, (value, key) =>
              hasPermission("customer", value, key)
            )}
          />,
          <Resource
            key="suppliers"
            name="suppliers"
            {...pickBy<ReactNode>(suppliers, (value, key) =>
              hasPermission("supplier", value, key)
            )}
          />,
          <Resource
            key="categories"
            name="categories"
            {...pickBy<ReactNode>(categories, (value, key) =>
              hasPermission("productcategory", value, key)
            )}
          />,
          <Resource
            key="departments"
            name="departments"
            {...pickBy<ReactNode>(departments, (value, key) =>
              hasPermission("department", value, key)
            )}
          />,
          <Resource
            key="roles"
            name="roles"
            {...pickBy<ReactNode>(roles, (value, key) =>
              hasPermission("role", value, key)
            )}
          />,
          <Resource key="designations" name="designations" />,
          <Resource
            key="employees"
            name="employees"
            {...pickBy<ReactNode>(employees, (value, key) =>
              hasPermission("user", value, key)
            )}
          />,
          <Resource key="credits_applications" name="credits_applications" />,
        ];
      }}
    </Admin>
  );
};
