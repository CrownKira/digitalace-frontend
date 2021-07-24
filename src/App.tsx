// TODO: order dependencies
import "./styles/app.scss";

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
import { adjustments } from "./transactions/adjustments";
import { sales_orders } from "./transactions/sales_orders";
import { purchase_orders } from "./transactions/purchase_orders";
import { customers } from "./maintenance/customers";
import { suppliers } from "./maintenance/suppliers";
import { categories } from "./maintenance/categories";
import { products } from "./maintenance/products";
import { payment_methods } from "./payment_methods";
import { payslips } from "./payslips";
import { hasPermission, getPermissionCodeNames } from "./utils";

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
        const permissionCodeNames = getPermissionCodeNames(userPermissions);

        return [
          <Resource
            key="invoices"
            name="invoices"
            // The keys are always strings. This means you can't use an object instance's identity as a key.
            {...pickBy<ReactNode>(invoices, (value, key) =>
              hasPermission(permissionCodeNames, "invoice", key)
            )}
          />,
          <Resource
            key="receives"
            name="receives"
            {...pickBy<ReactNode>(receives, (value, key) =>
              hasPermission(permissionCodeNames, "receive", key)
            )}
          />,
          <Resource
            key="credit_notes"
            name="credit_notes"
            {...pickBy<ReactNode>(credit_notes, (value, key) =>
              hasPermission(permissionCodeNames, "creditnote", key)
            )}
          />,
          <Resource
            key="adjustments"
            name="adjustments"
            {...pickBy<ReactNode>(adjustments, (value, key) =>
              hasPermission(permissionCodeNames, "adjustment", key)
            )}
          />,
          <Resource
            key="sales_orders"
            name="sales_orders"
            {...pickBy<ReactNode>(sales_orders, (value, key) =>
              hasPermission(permissionCodeNames, "salesorder", key)
            )}
          />,
          <Resource
            key="purchase_orders"
            name="purchase_orders"
            {...pickBy<ReactNode>(purchase_orders, (value, key) =>
              hasPermission(permissionCodeNames, "purchaseorder", key)
            )}
          />,
          <Resource
            key="products"
            name="products"
            {...pickBy<ReactNode>(products, (value, key) =>
              hasPermission(permissionCodeNames, "product", key)
            )}
          />,
          <Resource
            key="customers"
            name="customers"
            {...pickBy<ReactNode>(customers, (value, key) =>
              hasPermission(permissionCodeNames, "customer", key)
            )}
          />,
          <Resource
            key="suppliers"
            name="suppliers"
            {...pickBy<ReactNode>(suppliers, (value, key) =>
              hasPermission(permissionCodeNames, "supplier", key)
            )}
          />,
          <Resource
            key="categories"
            name="categories"
            {...pickBy<ReactNode>(categories, (value, key) =>
              hasPermission(permissionCodeNames, "productcategory", key)
            )}
          />,
          <Resource
            key="departments"
            name="departments"
            {...pickBy<ReactNode>(departments, (value, key) =>
              hasPermission(permissionCodeNames, "department", key)
            )}
          />,
          <Resource
            key="roles"
            name="roles"
            {...pickBy<ReactNode>(roles, (value, key) =>
              hasPermission(permissionCodeNames, "role", key)
            )}
          />,
          <Resource key="designations" name="designations" />,
          <Resource
            key="employees"
            name="employees"
            {...pickBy<ReactNode>(employees, (value, key) =>
              hasPermission(permissionCodeNames, "user", key)
            )}
          />,
          <Resource key="credits_applications" name="credits_applications" />,
          <Resource
            key="payment_methods"
            name="payment_methods"
            {...pickBy<ReactNode>(payment_methods, (value, key) =>
              hasPermission(permissionCodeNames, "paymentmethod", key)
            )}
          />,
          <Resource
            key="payslips"
            name="payslips"
            {...pickBy<ReactNode>(payslips, (value, key) =>
              hasPermission(permissionCodeNames, "payslip", key)
            )}
          />,
        ];
      }}
    </Admin>
  );
};
