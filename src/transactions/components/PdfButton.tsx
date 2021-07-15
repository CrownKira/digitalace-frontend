import * as React from "react";
import { FC, ReactElement } from "react";
import ActionList from "@material-ui/icons/List";
import { Link } from "react-router-dom";
import {
  useResourceContext,
  useNotify,
  Button,
  ButtonProps,
} from "react-admin";

export const PdfButton: FC<PdfButtonProps> = ({
  basePath = "",
  icon = defaultIcon,
  label = "pos.action.print",
  ...rest
}) => {
  const resource = useResourceContext();
  const notify = useNotify();

  const handleClick = (event: any) => {
    notify("pos.message.coming_soon");
  };

  return (
    <Button
      component={Link}
      to={basePath || `/${resource}`}
      label={label}
      onClick={handleClick}
      {...(rest as any)}
    >
      {icon}
    </Button>
  );
};

const defaultIcon = <ActionList />;

interface Props {
  basePath?: string;
  icon?: ReactElement;
  label?: string;
}

export type PdfButtonProps = Props & ButtonProps;

export default PdfButton;
