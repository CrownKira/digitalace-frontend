import CategoryIcon from "@material-ui/icons/Bookmark";

import { CategoryList } from "./CategoryList";
import { CategoryEdit } from "./CategoryEdit";
import { CategoryCreate } from "./CategoryCreate";

export const categories = {
  codename: "productcategory",
  list: CategoryList,
  create: CategoryCreate,
  edit: CategoryEdit,
  icon: CategoryIcon,
};
