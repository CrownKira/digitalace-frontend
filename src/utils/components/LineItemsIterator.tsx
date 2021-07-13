import React, {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  ReactElement,
  FC,
} from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import get from "lodash/get";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/RemoveOutlined";
import AddIcon from "@material-ui/icons/AddOutlined";
import ReorderIcon from "@material-ui/icons/Reorder";
import {
  useTranslate,
  ValidationError,
  Record,
  ClassesOverride,
  FormInput,
} from "react-admin";
import classNames from "classnames";
import { FieldArrayRenderProps } from "react-final-form-arrays";
import { PropertyPath } from "lodash";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DroppableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";

// FIXME: fix any
// TODO: make row draggable / up and down arrow button
// TODO: add item header button
const useStyles = makeStyles(
  (theme) => ({
    root: {
      padding: 0,
      marginBottom: 0,
      "& > li:last-child": {
        borderBottom: "none",
      },
    },
    line: {
      display: "flex",
      listStyleType: "none",
      borderBottom: `solid 1px ${theme.palette.divider}`,
      [theme.breakpoints.down("xs")]: { display: "block" },
    },
    container: {
      maxHeight: 440,
    },
    row: {
      // FIXME: animation not working
      "&.fade-enter": {
        opacity: 0.01,
        transform: "translateX(100vw)",
      },
      "&.fade-enter-active": {
        opacity: 1,
        transform: "translateX(0)",
        transition: "all 500ms ease-in",
      },
      "&.fade-exit": {
        opacity: 1,
        transform: "translateX(0)",
      },
      "&.fade-exit-active": {
        opacity: 0.01,
        transform: "translateX(100vw)",
        transition: "all 500ms ease-in",
      },
    },

    footer: {
      left: 0,
      bottom: 0,
      zIndex: 2,
      position: "sticky",
    },
    index: {
      width: "3em",
      paddingTop: "1em",
      [theme.breakpoints.down("sm")]: { display: "none" },
    },
    form: { flex: 2 },
    action: {
      paddingTop: "0.5em",
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
  }),
  { name: "RaLineItemsIterator" }
);

const DefaultAddButton = (props: any) => {
  const classes = useStyles(props);
  const translate = useTranslate();
  return (
    <Button size="small" color="primary" {...props}>
      <AddIcon className={classes.leftIcon} />
      {translate("ra.action.add")}
    </Button>
  );
};

const DefaultRemoveButton = (props: any) => {
  const classes = useStyles(props);
  const translate = useTranslate();
  return (
    <Button size="small" color="primary" {...props}>
      <CloseIcon className={classes.leftIcon} />
      {translate("ra.action.remove")}
    </Button>
  );
};

// const AddItemHeaderButton = (props: any) => {
//   const classes = useStyles(props);
//   const translate = useTranslate();
//   return (
//     <Button size="small" color="primary" {...props}>
//       <AddIcon className={classes.leftIcon} />
//       {translate("resources.invoices.action.add_item_header")}
//     </Button>
//   );
// };

// TODO: use Datagrid?
// https://material-ui.com/components/data-grid/editing/
export const LineItemsIterator: FC<LineItemsIteratorProps> = (props) => {
  const {
    addButton = <DefaultAddButton />,
    removeButton = <DefaultRemoveButton />,
    basePath,
    children,
    className,
    fields,
    meta,
    record,
    resource,
    source,
    disabled,
    disableAdd,
    disableRemove,
    variant,
    margin,
    TransitionProps,
    defaultValue,
    labels = [],
    draggable = true,
  } = props;
  // FIXME: fix any
  const { error, submitFailed } = meta as {
    error?: any;
    submitFailed?: boolean;
  };
  const classes = useStyles(props);
  const nodeRef = useRef(null);
  const translate = useTranslate();

  // We need a unique id for each field for a proper enter/exit animation
  // so we keep an internal map between the field position and an auto-increment id
  const nextId = useRef(
    fields && fields?.length
      ? fields?.length
      : defaultValue
      ? defaultValue.length
      : 0
  );

  // We check whether we have a defaultValue (which must be an array) before checking
  // the fields prop which will always be empty for a new record.
  // Without it, our ids wouldn't match the default value and we would get key warnings
  // on the CssTransition element inside our render method
  const ids = useRef(
    nextId.current > 0 ? Array.from(Array(nextId.current).keys()) : []
  );

  const removeField = (index: number) => () => {
    ids.current.splice(index, 1);
    fields?.remove(index);
  };

  // Returns a boolean to indicate whether to disable the remove button for certain fields?.
  // If disableRemove is a function, then call the function with the current record to
  // determining if the button should be disabled. Otherwise, use a boolean property that
  // enables or disables the button for all of the fields.
  const disableRemoveField = (
    record: Record,
    disableRemove: boolean | DisableRemoveFunction | undefined
  ) => {
    if (typeof disableRemove === "boolean") {
      return disableRemove;
    }
    return disableRemove && disableRemove(record);
  };

  const addField = () => {
    // qn: does this trigger re-render?
    ids.current.push(nextId.current++);
    fields?.push(undefined);
  };

  const swapFields = (startIndex: number, endIndex: number) => {
    fields?.swap(startIndex, endIndex);
  };

  // add field and call the onClick event of the button passed as addButton prop
  const handleAddButtonClick =
    (originalOnClickHandler: (event: any) => void) => (event: any) => {
      addField();
      if (originalOnClickHandler) {
        originalOnClickHandler(event);
      }
    };

  // remove field and call the onClick event of the button passed as removeButton prop
  const handleRemoveButtonClick =
    (originalOnClickHandler: (event: any) => void, index: number) =>
    (event: any) => {
      removeField(index)();
      if (originalOnClickHandler) {
        originalOnClickHandler(event);
      }
    };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    swapFields(result.source.index, result.destination.index);
  };

  const records = get(record, source as PropertyPath);
  const childrenCount = Children.count(children);
  return fields ? (
    <TableContainer className={classes.container}>
      <Table
        stickyHeader
        className={classNames(classes.root, className)}
        aria-label="line items table"
      >
        <TableHead>
          <TableRow>
            <TableCell align="left">&nbsp;</TableCell>
            {labels.length === childrenCount
              ? labels.map((label, index2) => {
                  return (
                    <TableCell
                      key={label}
                      align={index2 % 2 === 0 ? "left" : "right"}
                    >
                      {translate(label)}
                    </TableCell>
                  );
                })
              : Children.map(children, (input: ReactElement, index2) => {
                  // TODO: refactor
                  if (!isValidElement<any>(input)) {
                    return null;
                  }

                  const { source } = input.props;
                  return (
                    <TableCell align={index2 % 2 === 0 ? "left" : "right"}>
                      {translate(
                        typeof input.props.label === "undefined"
                          ? source
                            ? `resources.${resource}.fields.${source}`
                            : undefined
                          : input.props.label
                      )}
                    </TableCell>
                  );
                })}
            {!disableRemove && <TableCell align="left">&nbsp;</TableCell>}
          </TableRow>
        </TableHead>
        {submitFailed && typeof error !== "object" && error && (
          <FormHelperText error>
            <ValidationError error={error as string} />
          </FormHelperText>
        )}
        <TransitionGroup component={null}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable" direction="vertical">
              {(droppableProvided: DroppableProvided) => (
                <TableBody
                  ref={droppableProvided.innerRef}
                  {...droppableProvided.droppableProps}
                >
                  {fields?.map((member, index) => {
                    return (
                      <Draggable
                        key={ids.current[index]}
                        draggableId={String(ids.current[index])}
                        index={index}
                        isDragDisabled={draggable}
                      >
                        {(
                          draggableProvided: DraggableProvided,
                          snapshot: DraggableStateSnapshot
                        ) => {
                          return (
                            <CSSTransition
                              nodeRef={nodeRef}
                              key={ids.current[index]}
                              timeout={500}
                              classNames="fade"
                              {...TransitionProps}
                            >
                              <TableRow
                                key={ids.current[index]}
                                ref={draggableProvided.innerRef}
                                {...draggableProvided.draggableProps}
                                style={{
                                  ...draggableProvided.draggableProps.style,

                                  ...(snapshot.isDragging && {
                                    background: "rgb(245,245,245,0.75)",
                                  }),
                                }}
                                hover
                                className={classes.row}
                              >
                                <TableCell>
                                  <div {...draggableProvided.dragHandleProps}>
                                    {draggable && <ReorderIcon />}
                                  </div>
                                </TableCell>

                                {Children.map(
                                  children,
                                  (input: ReactElement, index2) => {
                                    if (!isValidElement<any>(input)) {
                                      return null;
                                    }
                                    const { source, ...inputProps } =
                                      input.props;

                                    return (
                                      <TableCell>
                                        <div>
                                          <FormInput
                                            basePath={
                                              input.props.basePath || basePath
                                            }
                                            input={cloneElement(input, {
                                              source: source
                                                ? `${member}.${source}`
                                                : member,
                                              index: source
                                                ? undefined
                                                : index2,
                                              label: "",
                                              disabled,
                                              ...inputProps,
                                            })}
                                            record={
                                              (records && records[index]) || {}
                                            }
                                            resource={resource}
                                            variant={variant}
                                            margin={margin}
                                          />
                                        </div>
                                      </TableCell>
                                    );
                                  }
                                )}
                                {!disabled &&
                                  !disableRemoveField(
                                    (records && records[index]) || {},
                                    disableRemove
                                  ) && (
                                    <TableCell>
                                      <div>
                                        {cloneElement(removeButton, {
                                          onClick: handleRemoveButtonClick(
                                            removeButton.props.onClick,
                                            index
                                          ),
                                          className: classNames(
                                            "button-remove",
                                            `button-remove-${source}-${index}`
                                          ),
                                        })}
                                      </div>
                                    </TableCell>
                                  )}
                              </TableRow>
                            </CSSTransition>
                          );
                        }}
                      </Draggable>
                    );
                  })}
                  {droppableProvided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        </TransitionGroup>
        {!disabled && !disableAdd && (
          <TableFooter className={classes.footer}>
            <TableRow>
              <TableCell colSpan={childrenCount + 1}>
                <span className={classes.action}>
                  {cloneElement(addButton, {
                    onClick: handleAddButtonClick(addButton.props.onClick),
                    className: classNames("button-add", `button-add-${source}`),
                  })}
                </span>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  ) : null;
};

LineItemsIterator.defaultProps = {
  disableAdd: false,
  disableRemove: false,
};

/*
TODO: pass down as a prop to this component 
<AddItemHeaderButton
  onClick={handleAddItemHeaderButtonClick}
  className={classNames("button-add", `button-add-${source}`)}
/>
*/

type DisableRemoveFunction = (record: Record) => boolean;

export interface LineItemsIteratorProps
  extends Partial<
    Omit<FieldArrayRenderProps<any, HTMLElement>, "meta" | "children">
  > {
  addButton?: ReactElement;
  basePath?: string;
  classes?: ClassesOverride<typeof useStyles>;
  className?: string;
  defaultValue?: any;
  disabled?: boolean;
  draggable?: boolean;
  disableAdd?: boolean;
  disableRemove?: boolean | DisableRemoveFunction;
  margin?: "none" | "normal" | "dense";
  meta?: {
    // the type defined in FieldArrayRenderProps says error is boolean, which is wrong.
    error?: any;
    submitFailed?: boolean;
  };
  record?: Record;
  removeButton?: ReactElement;
  resource?: string;
  source?: string;
  TransitionProps?: any;
  variant?: "standard" | "outlined" | "filled";
  labels?: string[];
  children: ReactElement[];
}
