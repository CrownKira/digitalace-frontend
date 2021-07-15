import ProductIcon from "@material-ui/icons/ShoppingBasketTwoTone";

import { ProductList } from "./ProductList";
import { ProductCreate } from "./ProductCreate";
import { ProductEdit } from "./ProductEdit";

export const products = {
  codename: "product",
  list: ProductList,
  create: ProductCreate,
  edit: ProductEdit,
  icon: ProductIcon,
};
