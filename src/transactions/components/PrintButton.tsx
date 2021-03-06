import React, { FC, ReactElement } from "react";
import PrintTwoToneIcon from "@material-ui/icons/PrintTwoTone";
import { Link } from "react-router-dom";
import {
  useResourceContext,
  useNotify,
  Button,
  ButtonProps,
} from "react-admin";

export const PrintButton: FC<PrintButtonProps> = ({
  basePath = "",
  icon = defaultIcon,
  label = "pos.action.pdf",
  ...rest
}) => {
  const resource = useResourceContext();
  const notify = useNotify();

  const handleClick = (event: any) => {
    notify("pos.message.coming_soon");
  };

  return (
    <Button
      // component={Link}
      // to={basePath || `/${resource}`}
      label={label}
      onClick={handleClick}
      {...(rest as any)}
    >
      {icon}
    </Button>
  );
};

const defaultIcon = <PrintTwoToneIcon />;

interface Props {
  basePath?: string;
  icon?: ReactElement;
  label?: string;
}

export type PrintButtonProps = Props & ButtonProps;

export default PrintButton;
