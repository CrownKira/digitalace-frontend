import CreditNoteIcon from "@material-ui/icons/DescriptionTwoTone";

import { CreditNoteList } from "./CreditNoteList";
import { CreditNoteCreate } from "./CreditNoteCreate";
import { CreditNoteEdit } from "./CreditNoteEdit";

export const credit_notes = {
  codename: "creditnote",
  list: CreditNoteList,
  create: CreditNoteCreate,
  edit: CreditNoteEdit,
  icon: CreditNoteIcon,
};
