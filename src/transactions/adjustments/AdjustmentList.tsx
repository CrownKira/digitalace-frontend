import React, { Fragment } from "react";
import { FC } from "react";
import {
  List,
  ListProps,
  Datagrid,
  TextField,
  DateField,
  Filter,
  FilterProps,
  SearchInput,
  DateInput,
  BulkDeleteButton,
  BulkDeleteButtonProps,
  SelectField,
} from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import pick from "lodash/pick";

import { AdjustmentShow } from "./AdjustmentShow";
import { statuses, modes } from "./data";
import { ColoredStatusField } from "../components/ColoredStatusField";
import { ListActionsWithImport } from "../../utils/components/ListActionsWithImport";
import { dateParser } from "../../utils";
import { useValidateRow } from "../hooks/useValidateRow";
import { validateReferenceUnicity } from "./AdjustmentCreate";

const ListFilters = (props: Omit<FilterProps, "children">) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <DateInput source="date__gte" />
    <DateInput source="date__lte" />
  </Filter>
);

// TODO: bulk action buttons props?
const AdjustmentBulkActionButtons: FC<BulkDeleteButtonProps> = (props) => (
  <Fragment>
    <BulkDeleteButton {...props} />
  </Fragment>
);

const useStyles = makeStyles((theme) => ({
  hiddenOnSmallScreens: {
    display: "table-cell",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));

const transformRows = (csvRows: any[]): Promise<any[]> => {
  if (csvRows.length === 0) {
    return Promise.resolve(csvRows);
  }

  const adjustmentKeys = ["reference", "date", "description", "status"];
  const getAdjustmentItem = (item: any) => {
    return item.adjustmentitem_set;
  };

  const transform = (data: any): any => {
    return {
      ...data,
      date: dateParser(data.date),
      description: data.description || "",
    };
  };

  const newCsvRowItem = csvRows.reduce((acc, item) => {
    if (item.reference) {
      item.adjustmentitem_set = [getAdjustmentItem(item)];
      const newItem = transform(pick(item, adjustmentKeys));
      acc.push(newItem);
      return acc;
    } else {
      acc[acc.length - 1].adjustmentitem_set.push(getAdjustmentItem(item));
      return acc;
    }
  }, []);

  return Promise.resolve(newCsvRowItem);
};

// TODO: customizable table columns
export const AdjustmentList: FC<ListProps> = (props) => {
  const classes = useStyles();

  const requiredFields = [
    "date",
    "reference",
    "status",
    "supplier",
    "adjustmentitem_set",
  ];

  const validateRow = useValidateRow({
    validateReferenceUnicity,
    requiredFields,
    itemSetKey: "adjustmentitem_set",
  });

  return (
    <List
      filters={<ListFilters />}
      perPage={25}
      sort={{ field: "id", order: "DESC" }}
      bulkActionButtons={<AdjustmentBulkActionButtons />}
      actions={
        <ListActionsWithImport importConfig={{ transformRows, validateRow }} />
      }
      {...props}
    >
      <Datagrid rowClick="edit" expand={<AdjustmentShow />}>
        <TextField source="reference" />
        <DateField source="date" />
        <ColoredStatusField source="status" choices={statuses} />
        <SelectField source="mode" choices={modes} />
        <TextField source="reason" />
      </Datagrid>
    </List>
  );
};
