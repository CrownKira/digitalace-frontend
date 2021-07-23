import React, { FC, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery, Theme, Box } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/LabelTwoTone";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWalletTwoTone";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCartTwoTone";
import StorageIcon from "@material-ui/icons/StorageTwoTone";
import BusinessIcon from "@material-ui/icons/BusinessTwoTone";
import {
  useTranslate,
  DashboardMenuItem,
  MenuItemLink,
  MenuProps,
  usePermissions,
} from "react-admin";
import { useSetLocale, useNotify, useDataProvider } from "react-admin";
import { useDispatch } from "react-redux";

import { changeTheme } from "../userMenu/configuration/actions";
import { UserConfig } from "../types";
import { departments } from "../organisation/departments";
import { roles } from "../organisation/roles";
import { employees } from "../organisation/employees";
import { customers } from "../maintenance/customers";
import { suppliers } from "../maintenance/suppliers";
import { categories } from "../maintenance/categories";
import { products } from "../maintenance/products";
import { invoices } from "../transactions/invoices";
import { receives } from "../transactions/receives";
import { credit_notes } from "../transactions/credit_notes";
import { adjustments } from "../transactions/adjustments";
import { purchase_orders } from "../transactions/purchase_orders";
import { sales_orders } from "../transactions/sales_orders";
import { SubMenu } from "./SubMenu";
import { AppState, ThemeName } from "../types";
import {
  hasPermission,
  refreshLocalStorage,
  getPermissionCodeNames,
} from "../utils";

type MenuName =
  | "menuOrganization"
  | "menuMaintenance"
  | "menuTransaction"
  | "menuOrder";

export const Menu: FC<MenuProps> = ({ onMenuClick, dense = false }) => {
  const [state, setState] = useState({
    menuOrganization: true,
    menuMaintenance: true,
    menuTransaction: true,
    menuOrder: true,
  });
  const translate = useTranslate();
  const isXSmall = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("xs")
  );
  const open = useSelector((state: AppState) => state.admin.ui.sidebarOpen);
  useSelector((state: AppState) => state.theme);
  const handleToggle = (menu: MenuName) => {
    setState((state) => ({ ...state, [menu]: !state[menu] }));
  };
  const dispatch = useDispatch();
  const setLocale = useSetLocale();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const { loaded, permissions } = usePermissions();

  useEffect(() => {
    // TODO: rewrite
    const theme = localStorage.getItem("theme");
    const language = localStorage.getItem("language");
    const updateStores = () => {
      theme && dispatch(changeTheme(theme as ThemeName));
      language && setLocale(language);
    };

    if (theme && language) {
      updateStores();
      return;
    }

    dataProvider
      .getUserConfig()
      .then((response: unknown) => {
        // for some reason response might be undefined
        // so we have to handle that
        if (response) {
          const {
            data: { theme, language },
          } = response as { data: UserConfig };
          // set config in first login and config update
          refreshLocalStorage({ theme, language });
          updateStores();
        }
      })
      .catch(() => {
        notify("pos.user_menu.user_config.data_provider_error", "warning");
      });
  }, [dataProvider, dispatch, notify, setLocale]);

  const permissionCodeNames = loaded ? getPermissionCodeNames(permissions) : [];

  return loaded ? (
    <Box mt={1}>
      <DashboardMenuItem onClick={onMenuClick} sidebarIsOpen={open} />
      <SubMenu
        handleToggle={() => handleToggle("menuOrganization")}
        isOpen={state.menuOrganization}
        sidebarIsOpen={open}
        name="pos.menu.organization"
        icon={<BusinessIcon />}
        dense={dense}
      >
        <MenuItemLink
          to={"/departments"}
          primaryText={translate("resources.departments.name", {
            smart_count: 2,
          })}
          leftIcon={<departments.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
          disabled={!hasPermission(permissionCodeNames, "department", "list")}
        />

        <MenuItemLink
          to={"/roles"}
          primaryText={translate("resources.roles.name", {
            smart_count: 2,
          })}
          leftIcon={<roles.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
          disabled={!hasPermission(permissionCodeNames, "role", "list")}
        />
        <MenuItemLink
          to={"/employees"}
          primaryText={translate("resources.employees.name", {
            smart_count: 2,
          })}
          leftIcon={<employees.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
          disabled={!hasPermission(permissionCodeNames, "user", "list")}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle("menuMaintenance")}
        isOpen={state.menuMaintenance}
        sidebarIsOpen={open}
        name="pos.menu.maintenance"
        icon={<StorageIcon />}
        dense={dense}
      >
        <MenuItemLink
          to={"/customers"}
          primaryText={translate("resources.customers.name", {
            smart_count: 2,
          })}
          leftIcon={<customers.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
          disabled={!hasPermission(permissionCodeNames, "customer", "list")}
        />
        <MenuItemLink
          to={"/suppliers"}
          primaryText={translate("resources.suppliers.name", {
            smart_count: 2,
          })}
          leftIcon={<suppliers.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
          disabled={!hasPermission(permissionCodeNames, "supplier", "list")}
        />
        <MenuItemLink
          to={"/categories"}
          primaryText={translate("resources.categories.name", {
            smart_count: 2,
          })}
          leftIcon={<categories.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
          disabled={
            !hasPermission(permissionCodeNames, "productcategory", "list")
          }
        />
        <MenuItemLink
          to={"/products"}
          primaryText={translate("resources.products.name", {
            smart_count: 2,
          })}
          leftIcon={<products.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
          disabled={!hasPermission(permissionCodeNames, "product", "list")}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle("menuTransaction")}
        isOpen={state.menuTransaction}
        sidebarIsOpen={open}
        name="pos.menu.transactions"
        icon={<AccountBalanceWalletIcon />}
        dense={dense}
      >
        <MenuItemLink
          to={"/invoices"}
          primaryText={translate("resources.invoices.name", {
            smart_count: 2,
          })}
          leftIcon={<invoices.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
          disabled={!hasPermission(permissionCodeNames, "invoice", "list")}
        />
        <MenuItemLink
          to={"/receives"}
          primaryText={translate("resources.receives.name", {
            smart_count: 2,
          })}
          leftIcon={<receives.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
          disabled={!hasPermission(permissionCodeNames, "receive", "list")}
        />
        <MenuItemLink
          to={"/credit_notes"}
          primaryText={translate("resources.credit_notes.name", {
            smart_count: 2,
          })}
          leftIcon={<credit_notes.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
          disabled={!hasPermission(permissionCodeNames, "creditnote", "list")}
        />
        <MenuItemLink
          to={"/adjustments"}
          primaryText={translate("resources.adjustments.name", {
            smart_count: 2,
          })}
          leftIcon={<adjustments.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
          disabled={!hasPermission(permissionCodeNames, "adjustment", "list")}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle("menuOrder")}
        isOpen={state.menuOrder}
        sidebarIsOpen={open}
        name="pos.menu.orders"
        icon={<ShoppingCartIcon />}
        dense={dense}
      >
        <MenuItemLink
          to={"/sales_orders"}
          primaryText={translate("resources.sales_orders.name", {
            smart_count: 2,
          })}
          leftIcon={<sales_orders.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
          disabled={!hasPermission(permissionCodeNames, "salesorder", "list")}
        />
        <MenuItemLink
          to={"/purchase_orders"}
          primaryText={translate("resources.purchase_orders.name", {
            smart_count: 2,
          })}
          leftIcon={<purchase_orders.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
          disabled={
            !hasPermission(permissionCodeNames, "purchaseorder", "list")
          }
        />
      </SubMenu>
      {isXSmall && (
        <MenuItemLink
          to="/configuration"
          primaryText={translate("pos.configuration")}
          leftIcon={<SettingsIcon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
      )}
    </Box>
  ) : null;
};
