import { FC, ReactElement, memo } from "react";
import PropTypes from "prop-types";
import { Fab, useMediaQuery, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ContentAdd from "@material-ui/icons/Add";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { useTranslate } from "ra-core";
import { ButtonProps, Button, useNotify } from "react-admin";

import { sanitizeButtonRestProps } from "../../utils";

const ApplyToInvoiceButton: FC<ApplyToInvoiceButtonProps> = (props) => {
  const {
    className,
    classes: classesOverride,
    icon = defaultIcon,
    label = "resources.credit_notes.action.apply_to_invoice",
    variant,
    ...rest
  } = props;
  const classes = useStyles(props);
  const translate = useTranslate();
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const notify = useNotify();

  return isSmall ? (
    <Fab
      component={Link}
      color="primary"
      className={classnames(classes.floating, className)}
      to=""
      aria-label={label && translate(label)}
      onClick={() => {
        notify("pos.message.coming_soon");
      }}
      {...sanitizeButtonRestProps(rest)}
    >
      {icon}
    </Fab>
  ) : (
    <Button
      component={Link}
      className={className}
      label={label}
      variant={variant}
      onClick={() => {
        notify("pos.message.coming_soon");
      }}
      {...(rest as any)}
    >
      {icon}
    </Button>
  );
};

const defaultIcon = <ContentAdd />;

const useStyles = makeStyles(
  (theme) => ({
    floating: {
      color: theme.palette.getContrastText(theme.palette.primary.main),
      margin: 0,
      top: "auto",
      right: 20,
      bottom: 60,
      left: "auto",
      position: "fixed",
      zIndex: 1000,
    },
  }),
  { name: "ApplyToInvoiceButton" }
);

interface Props {
  basePath?: string;
  icon?: ReactElement;
  scrollToTop?: boolean;
}

export type ApplyToInvoiceButtonProps = Props & ButtonProps;

ApplyToInvoiceButton.propTypes = {
  basePath: PropTypes.string,
  classes: PropTypes.object,
  className: PropTypes.string,
  icon: PropTypes.element,
  label: PropTypes.string,
};

export default memo(ApplyToInvoiceButton, (prevProps, nextProps) => {
  return (
    prevProps.basePath === nextProps.basePath &&
    prevProps.label === nextProps.label &&
    prevProps.translate === nextProps.translate &&
    prevProps.to === nextProps.to &&
    prevProps.disabled === nextProps.disabled
  );
});
