import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import SettingsIcon from '@material-ui/icons/Label';
import { useMediaQuery, Theme, Box } from '@material-ui/core';
import {
  useTranslate,
  DashboardMenuItem,
  MenuItemLink,
  MenuProps,
} from 'react-admin';

import customers from '../customers';
import suppliers from '../suppliers';
import products from '../products';
import invoices from '../invoices';
import receives from '../receives';
import purchase_orders from '../purchase_orders';
import sales_orders from '../sales_orders';
import SubMenu from './SubMenu';
import { AppState } from '../types';

type MenuName = 'menuMaintenance' | 'menuTransaction' | 'menuOrder';

const Menu: FC<MenuProps> = ({ onMenuClick, logout, dense = false }) => {
  const [state, setState] = useState({
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

  return (
    <Box mt={1}>
      {' '}
      <DashboardMenuItem onClick={onMenuClick} sidebarIsOpen={open} />
      <SubMenu
        handleToggle={() => handleToggle('menuMaintenance')}
        isOpen={state.menuMaintenance}
        sidebarIsOpen={open}
        name="pos.menu.maintenance"
        icon={<customers.icon />}
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
        icon={<invoices.icon />}
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
        icon={<invoices.icon />}
        dense={dense}
      >
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
