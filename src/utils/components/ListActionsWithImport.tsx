import React, { cloneElement, useMemo, FC } from "react";
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
  useNotify,
} from "react-admin";
import { ImportButton, ImportConfig } from "react-admin-import-csv";
import { getErrorMessage } from "..";

interface Props extends ListActionsProps {
  importConfig?: ImportConfig;
}

const getError = (error: any) => {
  return error[0].err;
};

export const ListActionsWithImport: FC<Props> = (props) => {
  const { className, exporter, filters, importConfig = {}, ...rest } = props;
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
  const notify = useNotify();
  const config: ImportConfig = {
    postCommitCallback: (error: any) => {
      notify(getErrorMessage(getError(error)), "warning");
    },
    ...importConfig,
  };

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
        <ImportButton {...props} {...config} />
      </TopToolbar>
    ),
    [resource, displayedFilters, filterValues, selectedIds, filters, total] // eslint-disable-line react-hooks/exhaustive-deps
  );
};

ListActionsWithImport.defaultProps = ListActions.defaultProps;

export default ListActionsWithImport;
