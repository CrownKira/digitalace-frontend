import ProductIcon from '@material-ui/icons/People';

import ProductList from './ProductList';
import ProductCreate from './ProductCreate';
import ProductEdit from './ProductEdit';

const resource = {
  list: ProductList,
  create: ProductCreate,
  edit: ProductEdit,
  icon: ProductIcon,
};

export default resource;