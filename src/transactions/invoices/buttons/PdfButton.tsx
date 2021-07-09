import React, { cloneElement, FC, ReactElement, SyntheticEvent } from "react";
import Button, { ButtonProps } from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import classnames from "classnames";
import {
  useTranslate,
  useNotify,
  RedirectionSideEffect,
  OnSuccess,
  OnFailure,
  TransformData,
  Record,
  HandleSubmitWithRedirect,
} from "react-admin";
import { FormRenderProps } from "react-final-form";

import { sanitizeButtonRestProps } from "../../../utils";

export const PdfButton: FC<PdfButtonProps> = (props) => {
  const {
    className,
    classes: classesOverride,
    invalid,
    label = "resources.invoices.action.pdf",
    disabled,
    redirect,

    variant = "contained",
    icon = defaultIcon,
    onClick,
    handleSubmitWithRedirect,
    onSave,
    onSuccess,
    onFailure,
    transform,
    ...rest
  } = props;
  const classes = useStyles(props);
  const notify = useNotify();
  const translate = useTranslate();

  const handleClick = (event: any) => {
    notify("pos.message.coming_soon");
  };

  const displayedLabel = label && translate(label, { _: label });
  return (
    <Button
      className={classnames(classes.button, className)}
      variant={variant}
      // type={type}
      onClick={handleClick}
      color="default"
      aria-label={displayedLabel}
      disabled={disabled}
      {...sanitizeButtonRestProps(rest)}
    >
      {cloneElement(icon, {
        className: classnames(classes.leftIcon, classes.icon),
      })}
      {displayedLabel}
    </Button>
  );
};

const defaultIcon = <PictureAsPdfIcon />;

const useStyles = makeStyles(
  (theme) => ({
    button: {
      position: "relative",
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    icon: {
      fontSize: 18,
    },
  }),
  { name: "PdfButton" }
);

interface Props {
  classes?: object;
  className?: string;
  handleSubmitWithRedirect?:
    | HandleSubmitWithRedirect
    | FormRenderProps["handleSubmit"];
  // @deprecated
  onSave?: (values: object, redirect: RedirectionSideEffect) => void;
  onSuccess?: OnSuccess;
  onFailure?: OnFailure;
  transform?: TransformData;
  icon?: ReactElement;
  invalid?: boolean;
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  redirect?: RedirectionSideEffect;
  saving?: boolean;
  submitOnEnter?: boolean;
  variant?: string;
  // May be injected by Toolbar - sanitized in Button
  basePath?: string;
  handleSubmit?: (event?: SyntheticEvent<HTMLFormElement>) => Promise<Object>;
  record?: Record;
  resource?: string;
  undoable?: boolean;
}

export type PdfButtonProps = Props & ButtonProps;
