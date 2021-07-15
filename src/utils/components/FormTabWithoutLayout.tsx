/* eslint-disable @typescript-eslint/ban-types */
import React, { FC, ReactElement, ReactNode } from "react";
import { FormTabHeader, Record } from "react-admin";

const hiddenStyle = { display: "none" };

export const FormTabWithoutLayout: FC<FormTabProps> = ({
  // basePath,
  className,
  classes,
  contentClassName,
  children,
  hidden,
  icon,
  intent,
  label,
  // margin,
  // path,
  // record,
  // resource,
  // variant,
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

FormTabWithoutLayout.displayName = "FormTab";

/*
TODO: include formGroupContext?
<FormGroupContextProvider name={value?.toString() || ''}>
*/
