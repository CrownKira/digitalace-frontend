import React, { FC, cloneElement, Children, ReactElement } from "react";
import {
  FilterPayload,
  SortPayload,
  useReferenceManyFieldController,
  ListContextProvider,
  ListControllerProps,
  ResourceContextProvider,
  useRecordContext,
  ReduxState,
  sanitizeFieldRestProps,
  PublicFieldProps,
  InjectedFieldProps,
  ListToolbar,
  ListActions,
} from "react-admin";
import { useSelector } from "react-redux";

export const ReferenceManyFieldWithActions: FC<ReferenceManyFieldWithActionsProps> =
  (props) => {
    const {
      basePath,
      children,
      filter,
      page = 1,
      perPage,
      reference,
      resource,
      sort,
      source,
      target,
    } = props;
    const record = useRecordContext(props);

    if (React.Children.count(children) !== 1) {
      throw new Error(
        "<ReferenceManyFieldWithActions> only accepts a single child (like <Datagrid>)"
      );
    }

    const isReferenceDeclared = useSelector<ReduxState, boolean>(
      (state) => typeof state.admin.resources[props.reference] !== "undefined"
    );

    if (!isReferenceDeclared) {
      throw new Error(
        `You must declare a <Resource name="${props.reference}"> in order to use a <ReferenceManyFieldWithActions reference="${props.reference}">`
      );
    }

    const controllerProps = useReferenceManyFieldController({
      basePath,
      filter,
      page,
      perPage,
      record,
      reference,
      resource: resource as string, // FIXME: resource can be undefined
      sort,
      source,
      target,
    });

    return (
      <ResourceContextProvider value={reference}>
        <ListContextProvider value={controllerProps}>
          <ReferenceManyFieldWithActionsView {...props} {...controllerProps} />
        </ListContextProvider>
      </ResourceContextProvider>
    );
  };

export interface ReferenceManyFieldWithActionsProps
  extends PublicFieldProps,
    InjectedFieldProps {
  children: ReactElement;
  filter?: FilterPayload;
  page?: number;
  pagination?: ReactElement;
  perPage?: number;
  reference: string;
  sort?: SortPayload;
  target: string;
  actions?: ReactElement | false;
}

ReferenceManyFieldWithActions.defaultProps = {
  filter: {},
  perPage: 25,
  sort: { field: "id", order: "DESC" },
  source: "id",
  addLabel: true,
  actions: <ListActions />,
};

export const ReferenceManyFieldWithActionsView: FC<ReferenceManyFieldWithActionsViewProps> =
  (props) => {
    const { basePath, children, pagination, reference, actions, ...rest } =
      props;
    return (
      <>
        {actions && <ListToolbar actions={actions} />}
        {cloneElement(Children.only(children), {
          ...sanitizeFieldRestProps(rest),
          basePath,
          resource: reference,
        })}
        {pagination && props.total !== undefined && cloneElement(pagination)}
      </>
    );
  };

export interface ReferenceManyFieldWithActionsViewProps
  extends Omit<
      ReferenceManyFieldWithActionsProps,
      "basePath" | "resource" | "page" | "perPage"
    >,
    ListControllerProps {
  children: ReactElement;
}

export default ReferenceManyFieldWithActions;
