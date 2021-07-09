import CreditNoteIcon from "@material-ui/icons/Description";

import { CreditNoteList } from "./CreditNoteList";
import { CreditNoteCreate } from "./CreditNoteCreate";
import { CreditNoteEdit } from "./CreditNoteEdit";

export const credit_notes = {
  codename: "credit_note",
  list: CreditNoteList,
  create: CreditNoteCreate,
  edit: CreditNoteEdit,
  icon: CreditNoteIcon,
};
