import AnnouncementIcon from "@material-ui/icons/AnnouncementTwoTone";

import { AnnouncementList } from "./AnnouncementList";
import { AnnouncementCreate } from "./AnnouncementCreate";
import { AnnouncementEdit } from "./AnnouncementEdit";

export const announcements = {
  codename: "announcement",
  list: AnnouncementList,
  create: AnnouncementCreate,
  edit: AnnouncementEdit,
  icon: AnnouncementIcon,
};
