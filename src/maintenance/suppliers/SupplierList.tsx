import React, { ReactElement } from "react";
import {
  TextField,
  EmailField,
  Datagrid,
  Filter,
  FilterProps,
  List,
  ListProps,
  SearchInput,
} from "react-admin";
import { useMediaQuery, Theme } from "@material-ui/core";

import { SupplierLinkField } from "./SupplierLinkField";
import { ColoredNumberField } from "./ColoredNumberField";
import { MobileGrid } from "./MobileGrid";
import { Aside as SupplierListAside } from "./SupplierListAside";
import { ListActionsWithImport } from "../../utils/components/ListActionsWithImport";

const SupplierFilter = (props: Omit<FilterProps, "children">) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
  </Filter>
);

export const SupplierList = (props: ListProps): ReactElement => {
  const isXsmall = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down("xs")
  );
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  return (
    <List
      filters={isSmall ? <SupplierFilter /> : undefined}
      sort={{ field: "last_seen", order: "DESC" }}
      perPage={25}
      aside={<SupplierListAside />}
      actions={<ListActionsWithImport />}
      {...props}
    >
      {isXsmall ? (
        <MobileGrid />
      ) : (
        <Datagrid optimized rowClick="edit">
          <SupplierLinkField />
          <TextField source="attention" />
          <EmailField source="email" />
          <TextField source="phone_no" />
          <ColoredNumberField source="payables" />
        </Datagrid>
      )}
    </List>
  );
};
