import CustomerIcon from '@material-ui/icons/AccountCircle';

import CustomerList from './CustomerList';
import CustomerCreate from './CustomerCreate';
import CustomerEdit from './CustomerEdit';

const resource = {
  list: CustomerList,
  create: CustomerCreate,
  edit: CustomerEdit,
  icon: CustomerIcon,
};

export default resource;
