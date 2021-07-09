import React from "react";
import React, { FC, ReactElement, ReactNode } from "react";
import PropTypes from "prop-types";
import { Record } from "ra-core";
import { FormTabHeader } from "react-admin";

const hiddenStyle = { display: "none" };

export const FormTabWithLayout: FC<FormTabProps> = ({
  basePath,
  className,
  classes,
  contentClassName,
  children,
  hidden,
  icon,
  intent,
  label,
  margin,
  path,
  record,
  resource,
  variant,
  value,
  ...rest
}) => {
  const renderHeader = () => (
    <FormTabHeader
      label={label}
      value={value}
      icon={icon}
      className={className}
      classes={classes}
      {...rest}
    />
  );

  const renderContent = () => (
    <span
      style={hidden ? hiddenStyle : undefined}
      className={contentClassName}
      id={`tabpanel-${value}`}
      aria-labelledby={`tabheader-${value}`}
      // Set undefined instead of false because WAI-ARIA Authoring Practices 1.1
      // notes that aria-hidden="false" currently behaves inconsistently across browsers.
      aria-hidden={hidden || undefined}
    >
      {React.Children.map(
        children as
          | ReactElement<any, string | React.JSXElementConstructor<any>>
          | ReactElement<any, string | React.JSXElementConstructor<any>>[],

        (input: ReactElement) => input
      )}
    </span>
  );

  return intent === "header" ? renderHeader() : renderContent();
};

FormTabWithLayout.propTypes = {
  basePath: PropTypes.string,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  children: PropTypes.node,
  intent: PropTypes.oneOf(["header", "content"]),
  hidden: PropTypes.bool,
  icon: PropTypes.element,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  margin: PropTypes.oneOf(["none", "dense", "normal"]),
  path: PropTypes.string,
  // @ts-ignore
  record: PropTypes.object,
  resource: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  variant: PropTypes.oneOf(["standard", "outlined", "filled"]),
};

export interface FormTabProps {
  basePath?: string;
  className?: string;
  classes?: object;
  children?: ReactNode;
  contentClassName?: string;
  hidden?: boolean;
  icon?: ReactElement;
  intent?: "header" | "content";
  label: string | ReactElement;
  margin?: "none" | "normal" | "dense";
  path?: string;
  record?: Record;
  resource?: string;
  syncWithLocation?: boolean;
  value?: string | number;
  variant?: "standard" | "outlined" | "filled";
}

FormTabWithLayout.displayName = "FormTab";

/*
TODO: include formGroupContext?
<FormGroupContextProvider name={value?.toString() || ''}>
*/
