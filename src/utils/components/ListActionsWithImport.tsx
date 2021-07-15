import * as React from "react";
import { cloneElement, useMemo, FC } from "react";
import {
  sanitizeListRestProps,
  useListContext,
  useResourceContext,
  useResourceDefinition,
  ListActions,
  ListActionsProps,
  TopToolbar,
  CreateButton,
  ExportButton,
} from "react-admin";
import { ImportButton } from "react-admin-import-csv";

export const ListActionsWithImport: FC<ListActionsProps> = (props) => {
  const { className, exporter, filters, ...rest } = props;
  const {
    currentSort,
    displayedFilters,
    filterValues,
    basePath,
    selectedIds,
    showFilter,
    total,
  } = useListContext(props);
  const resource = useResourceContext(rest);
  const { hasCreate } = useResourceDefinition(rest);
  return useMemo(
    () => (
      <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
        {filters &&
          cloneElement(filters, {
            resource,
            showFilter,
            displayedFilters,
            filterValues,
            context: "button",
          })}
        {hasCreate && <CreateButton basePath={basePath} />}
        {exporter !== false && (
          <ExportButton
            disabled={total === 0}
            resource={resource}
            sort={currentSort}
            filterValues={filterValues}
          />
        )}
        <ImportButton {...props} />
      </TopToolbar>
    ),
    [resource, displayedFilters, filterValues, selectedIds, filters, total] // eslint-disable-line react-hooks/exhaustive-deps
  );
};

ListActionsWithImport.defaultProps = ListActions.defaultProps;

export default ListActionsWithImport;
