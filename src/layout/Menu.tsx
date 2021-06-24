import { FC, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SettingsIcon from '@material-ui/icons/Label';
import { useMediaQuery, Theme, Box } from '@material-ui/core';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import StorageIcon from '@material-ui/icons/Storage';
import BusinessIcon from '@material-ui/icons/Business';
import {
  useTranslate,
  DashboardMenuItem,
  MenuItemLink,
  MenuProps,
} from 'react-admin';
import { useSetLocale, useNotify, useDataProvider } from 'react-admin';
import { useDispatch } from 'react-redux';

import { changeTheme } from '../configuration/actions';
import { UserConfig } from '../types';
import departments from '../departments';
import roles from '../roles';
import employees from '../employees';
import customers from '../customers';
import suppliers from '../suppliers';
import categories from '../categories';
import products from '../products';
import invoices from '../invoices';
import receives from '../receives';
import purchase_orders from '../purchase_orders';
import sales_orders from '../sales_orders';
import SubMenu from './SubMenu';
import { AppState } from '../types';

type MenuName =
  | 'menuOrganization'
  | 'menuMaintenance'
  | 'menuTransaction'
  | 'menuOrder';

const Menu: FC<MenuProps> = ({ onMenuClick, logout, dense = false }) => {
  const [state, setState] = useState({
    menuOrganization: true,
    menuMaintenance: true,
    menuTransaction: true,
    menuOrder: true,
  });
  const translate = useTranslate();
  const isXSmall = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('xs')
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

  useEffect(() => {
    dataProvider
      .getUserConfig()
      .then(({ data }: { data: UserConfig }) => {
        dispatch(changeTheme(data.theme));
        setLocale(data.language);
      })
      .catch(() => {
        notify('ra.notification.data_provider_error', 'warning');
      });
  }, [dataProvider, dispatch, notify, setLocale]);

  return (
    <Box mt={1}>
      {' '}
      <DashboardMenuItem onClick={onMenuClick} sidebarIsOpen={open} />
      <SubMenu
        handleToggle={() => handleToggle('menuOrganization')}
        isOpen={state.menuOrganization}
        sidebarIsOpen={open}
        name="pos.menu.organization"
        icon={<BusinessIcon />}
        dense={dense}
      >
        <MenuItemLink
          to={'/departments'}
          primaryText={translate('resources.departments.name', {
            smart_count: 2,
          })}
          leftIcon={<departments.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />

        <MenuItemLink
          to={'/roles'}
          primaryText={translate('resources.roles.name', {
            smart_count: 2,
          })}
          leftIcon={<roles.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
        <MenuItemLink
          to={'/employees'}
          primaryText={translate('resources.employees.name', {
            smart_count: 2,
          })}
          leftIcon={<employees.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle('menuMaintenance')}
        isOpen={state.menuMaintenance}
        sidebarIsOpen={open}
        name="pos.menu.maintenance"
        icon={<StorageIcon />}
        dense={dense}
      >
        <MenuItemLink
          to={'/customers'}
          primaryText={translate('resources.customers.name', {
            smart_count: 2,
          })}
          leftIcon={<customers.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
        <MenuItemLink
          to={'/suppliers'}
          primaryText={translate('resources.suppliers.name', {
            smart_count: 2,
          })}
          leftIcon={<suppliers.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
        <MenuItemLink
          to={'/categories'}
          primaryText={translate('resources.categories.name', {
            smart_count: 2,
          })}
          leftIcon={<categories.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
        <MenuItemLink
          to={'/products'}
          primaryText={translate('resources.products.name', {
            smart_count: 2,
          })}
          leftIcon={<products.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle('menuTransaction')}
        isOpen={state.menuTransaction}
        sidebarIsOpen={open}
        name="pos.menu.transactions"
        icon={<AccountBalanceWalletIcon />}
        dense={dense}
      >
        <MenuItemLink
          to={'/invoices'}
          primaryText={translate('resources.invoices.name', {
            smart_count: 2,
          })}
          leftIcon={<invoices.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
        <MenuItemLink
          to={'/receives'}
          primaryText={translate('resources.receives.name', {
            smart_count: 2,
          })}
          leftIcon={<receives.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle('menuOrder')}
        isOpen={state.menuOrder}
        sidebarIsOpen={open}
        name="pos.menu.orders"
        icon={<ShoppingCartIcon />}
        dense={dense}
      >
        <MenuItemLink
          to={'/sales_orders'}
          primaryText={translate('resources.sales_orders.name', {
            smart_count: 2,
          })}
          leftIcon={<sales_orders.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
        <MenuItemLink
          to={'/purchase_orders'}
          primaryText={translate('resources.purchase_orders.name', {
            smart_count: 2,
          })}
          leftIcon={<purchase_orders.icon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
      </SubMenu>
      {isXSmall && (
        <MenuItemLink
          to="/configuration"
          primaryText={translate('pos.configuration')}
          leftIcon={<SettingsIcon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
      )}
    </Box>
  );
};

export default Menu;
