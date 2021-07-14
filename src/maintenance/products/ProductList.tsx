import React, { FC } from "react";
import { Box, useMediaQuery, Theme } from "@material-ui/core";
import {
  CreateButton,
  ExportButton,
  Filter,
  FilterProps,
  ListBase,
  ListProps,
  Pagination,
  ReferenceInput,
  SearchInput,
  SelectInput,
  SortButton,
  Title,
  TopToolbar,
  useListContext,
} from "react-admin";

import { GridList } from "./GridList";
import { Aside } from "./Aside";
import { QuickFilter } from "../../utils";

export const ProductFilter: FC<Omit<FilterProps, "children">> = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <ReferenceInput
      source="category"
      reference="categories"
      sort={{ field: "id", order: "ASC" }}
    >
      <SelectInput source="name" />
    </ReferenceInput>
    <QuickFilter
      label="resources.products.fields.stock__lte"
      source="stock__lte"
      defaultValue={10}
    />
  </Filter>
);

const ListActions: FC<any> = ({ isSmall }) => (
  <TopToolbar>
    {isSmall && <ProductFilter context="button" />}
    <SortButton fields={["id", "sales", "stock"]} />
    <CreateButton basePath="/products" />
    <ExportButton />
  </TopToolbar>
);

export const ProductList: FC<ListProps> = (props) => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  return (
    <ListBase perPage={20} sort={{ field: "id", order: "ASC" }} {...props}>
      <ProductListView isSmall={isSmall} />
    </ListBase>
  );
};

const ProductListView: FC<{ isSmall: boolean }> = ({ isSmall }) => {
  const { defaultTitle } = useListContext();
  return (
    <>
      <Title defaultTitle={defaultTitle} />
      <ListActions isSmall={isSmall} />
      {isSmall && (
        <Box m={1}>
          <ProductFilter context="form" />
        </Box>
      )}
      <Box display="flex">
        <Aside />
        <Box
          // isSmall ? 'auto' : 'calc(100% - 16em)'
          width={"100%"}
        >
          <GridList />
          <Pagination rowsPerPageOptions={[10, 20, 40]} />
        </Box>
      </Box>
    </>
  );
};
