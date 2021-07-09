import ProductIcon from '@material-ui/icons/ShoppingBasket';

import { ProductList } from './ProductList';
import { ProductCreate } from './ProductCreate';
import { ProductEdit } from './ProductEdit';

export const products = {
  codename: 'product',
  list: ProductList,
  create: ProductCreate,
  edit: ProductEdit,
  icon: ProductIcon,
};
