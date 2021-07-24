import React, { FC } from "react";
import {
  Edit,
  EditProps,
  Toolbar,
  FormWithRedirect,
  SaveButton,
  TabbedFormView,
  DeleteButton,
  useNotify,
  useRefresh,
  Record,
  EditActionsProps,
  TopToolbar,
  ListButton,
} from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import ChevronLeft from "@material-ui/icons/ChevronLeftTwoTone";

import { useOnFailure } from "../../utils/hooks";
import {
  transform,
  styles as createStyles,
  validateForm,
} from "./AdjustmentCreate";
import { FormTabWithoutLayout } from "../../utils/components/FormTabWithoutLayout";
import { PdfButton } from "../components/PdfButton";
import { PrintButton } from "../components/PrintButton";
import { LineItemsSection } from "./sections/LineItemsSection";
import { DetailsTopSection } from "./sections/DetailsTopSection";
import { DetailsBottomSection } from "./sections/DetailsBottomSection";
import { DetailsAlertSection } from "./sections/DetailsAlertSection";
import { Separator } from "../../utils/components/Divider";

const useStyles = makeStyles({
  ...createStyles,
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
});

const PostEditActions: FC<EditActionsProps> = ({ basePath }) => (
  // https://github.com/marmelab/react-admin/issues/2741
  <TopToolbar>
    <ListButton basePath={basePath} label="Back" icon={<ChevronLeft />} />
    <PdfButton />
    <PrintButton />
  </TopToolbar>
);

export const AdjustmentEdit: FC<EditProps> = (props) => {
  return (
    <Edit actions={<PostEditActions />} mutationMode="pessimistic" {...props}>
      <AdjustmentForm />
    </Edit>
  );
};

const AdjustmentForm = (props: any) => {
  const classes = useStyles();
  const refresh = useRefresh();
  const notify = useNotify();
  const onFailure = useOnFailure();
  const onSuccess = ({ data }: { data: Record }) => {
    notify(`Changes to "${data.reference}" saved`);
    refresh();
  };

  return (
    <FormWithRedirect
      warnWhenUnsavedChanges
      validate={validateForm}
      {...props}
      render={(formProps: any) => {
        return (
          <TabbedFormView
            {...formProps}
            toolbar={
              <Toolbar
                // props from react-admin demo VisitorEdit
                resource="adjustments"
                record={formProps.record}
                basePath={formProps.basePath}
                invalid={formProps.invalid}
                handleSubmit={formProps.handleSubmit}
                saving={formProps.saving}
                pristine={formProps.pristine}
                classes={{ toolbar: classes.toolbar }}
              >
                <SaveButton
                  // props from Toolbar.tsx
                  // TODO: disable when pristine?
                  handleSubmitWithRedirect={
                    formProps.handleSubmitWithRedirect || formProps.handleSubmit
                  }
                  disabled={formProps.disabled}
                  invalid={formProps.invalid}
                  redirect={formProps.redirect}
                  saving={formProps.saving}
                  submitOnEnter={formProps.submitOnEnter}
                  transform={transform}
                  onFailure={onFailure}
                  onSuccess={onSuccess}
                />
                {formProps.record && formProps.record.id !== undefined && (
                  <DeleteButton
                    // props from Toolbar.tsx
                    basePath={formProps.basePath}
                    record={formProps.record}
                    resource={formProps.resource}
                    mutationMode={formProps.mutationMode}
                  />
                )}
              </Toolbar>
            }
          >
            <FormTabWithoutLayout label="resources.adjustments.tabs.details">
              <DetailsAlertSection record={formProps.record} />
              <Separator />
              <DetailsTopSection props={props} />
              <LineItemsSection
                source="adjustmentitem_set"
                resource="adjustment_items"
                label="resources.adjustments.fields.adjustmentitem_set"
              />
              <DetailsBottomSection />
            </FormTabWithoutLayout>
          </TabbedFormView>
        );
      }}
    />
  );
};