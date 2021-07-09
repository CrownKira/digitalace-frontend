import { FC } from "react";
import Avatar from "@material-ui/core/Avatar";
import { FieldProps } from "react-admin";

import { Role } from "../../types";

// react-admin
interface Props extends FieldProps<Role> {
  className?: string;
  size?: string;
}

export const AvatarField: FC<Props> = ({ record, size = "25", className }) =>
  record ? (
    <Avatar
      src={`${record.image?.src}?size=${size}x${size}`}
      style={{ width: parseInt(size, 10), height: parseInt(size, 10) }}
      className={className}
    />
  ) : null;
