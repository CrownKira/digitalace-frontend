import * as React from "react";
import {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  ReactElement,
  FC,
} from "react";
import PropTypes from "prop-types";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import get from "lodash/get";
import {
  Box,
  InputAdornment,
  TableContainer,
  Table,
  Paper,
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
import {
  useTranslate,
  ValidationError,
  Record,
  ClassesOverride,
  FormInput,
  useNotify,
  SimpleFormIterator,
} from "react-admin";
import classNames from "classnames";
import { FieldArrayRenderProps } from "react-final-form-arrays";
import { PropertyPath } from "lodash";

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

const AddItemHeaderButton = (props: any) => {
  const classes = useStyles(props);
  const translate = useTranslate();
  return (
    <Button size="small" color="primary" {...props}>
      <AddIcon className={classes.leftIcon} />
      {translate("resources.invoices.action.add_item_header")}
    </Button>
  );
};

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
  } = props;
  // FIXME: fix any
  const { error, submitFailed } = meta as any;
  const classes = useStyles(props);
  const nodeRef = useRef(null);
  const translate = useTranslate();
  const notify = useNotify();

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

  const removeField = (index: any) => () => {
    ids.current.splice(index, 1);
    fields?.remove(index);
  };

  // Returns a boolean to indicate whether to disable the remove button for certain fields?.
  // If disableRemove is a function, then call the function with the current record to
  // determining if the button should be disabled. Otherwise, use a boolean property that
  // enables or disables the button for all of the fields.
  const disableRemoveField = (record: any, disableRemove: any) => {
    if (typeof disableRemove === "boolean") {
      return disableRemove;
    }
    return disableRemove && disableRemove(record);
  };

  const addField = () => {
    ids.current.push(nextId.current++);
    fields?.push(undefined);
  };

  // add field and call the onClick event of the button passed as addButton prop
  const handleAddButtonClick =
    (originalOnClickHandler: any) => (event: any) => {
      addField();
      if (originalOnClickHandler) {
        originalOnClickHandler(event);
      }
    };

  // remove field and call the onClick event of the button passed as removeButton prop
  const handleRemoveButtonClick =
    (originalOnClickHandler: any, index: any) => (event: any) => {
      removeField(index)();
      if (originalOnClickHandler) {
        originalOnClickHandler(event);
      }
    };

  // const handleAddItemHeaderButtonClick = (event: any) => {
  //   notify("pos.message.coming_soon");
  // };

  const records = get(record, source as PropertyPath);
  const childrenCount = Children.count(children as any);
  return fields ? (
    <TableContainer className={classes.container}>
      <Table
        stickyHeader
        className={classNames(classes.root, className)}
        aria-label="line items table"
      >
        <TableHead>
          <TableRow>
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
              : Children.map(children as any, (input: ReactElement, index2) => {
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
            <TableCell />
          </TableRow>
        </TableHead>
        {submitFailed && typeof error !== "object" && error && (
          <FormHelperText error>
            <ValidationError error={error as string} />
          </FormHelperText>
        )}
        <TransitionGroup component={TableBody}>
          {fields?.map((member: any, index: any) => (
            <CSSTransition
              nodeRef={nodeRef}
              key={ids.current[index]}
              timeout={500}
              classNames="fade"
              {...TransitionProps}
            >
              <TableRow hover className={classes.row} key={ids.current[index]}>
                {Children.map(
                  children as any,
                  (input: ReactElement, index2) => {
                    if (!isValidElement<any>(input)) {
                      return null;
                    }
                    const { source, ...inputProps } = input.props;
                    return (
                      <TableCell>
                        <FormInput
                          basePath={input.props.basePath || basePath}
                          input={cloneElement(input, {
                            source: source ? `${member}.${source}` : member,
                            index: source ? undefined : index2,
                            label: "",
                            disabled,
                            ...inputProps,
                          })}
                          record={(records && records[index]) || {}}
                          resource={resource}
                          variant={variant}
                          margin={margin}
                        />
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
                    </TableCell>
                  )}
              </TableRow>
            </CSSTransition>
          ))}
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

/*
TODO: pass down as a prop to this component 
<AddItemHeaderButton
  onClick={handleAddItemHeaderButtonClick}
  className={classNames("button-add", `button-add-${source}`)}
/>
*/

LineItemsIterator.defaultProps = {
  disableAdd: false,
  disableRemove: false,
};

/*
TODO: remove this?
LineItemsIterator.propTypes = {
  defaultValue: PropTypes.any,
  addButton: PropTypes.element,
  removeButton: PropTypes.element,
  basePath: PropTypes.string,
  children: PropTypes.node,
  classes: PropTypes.object,
  className: PropTypes.string,
  // @ts-ignore
  fields: PropTypes.object,
  meta: PropTypes.object,
  // @ts-ignore
  record: PropTypes.object,
  source: PropTypes.string,
  resource: PropTypes.string,
  translate: PropTypes.func,
  disableAdd: PropTypes.bool,
  disableRemove: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  TransitionProps: PropTypes.shape({}),
};
*/

type DisableRemoveFunction = (record: Record) => boolean;

export interface LineItemsIteratorProps
  extends Partial<Omit<FieldArrayRenderProps<any, HTMLElement>, "meta">> {
  addButton?: ReactElement;
  basePath?: string;
  classes?: ClassesOverride<typeof useStyles>;
  className?: string;
  defaultValue?: any;
  disabled?: boolean;
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
}
