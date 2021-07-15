import React, { forwardRef } from "react";
import { AppBar, UserMenu, MenuItemLink, useTranslate } from "react-admin";
import Typography from "@material-ui/core/Typography";
import SettingsIcon from "@material-ui/icons/SettingsTwoTone";
import FaceIcon from "@material-ui/icons/FaceTwoTone";
import { makeStyles } from "@material-ui/core/styles";
import { useProfile } from "../userMenu/profile/Profile";

import { Logo } from "./Logo";

const useStyles = makeStyles((theme) => ({
  title: {
    flex: 1,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    [theme.breakpoints.down("xs")]: {
      opacity: 0,
    },
  },
  spacer: {
    flex: 1,
  },
}));

const ConfigurationMenu = forwardRef<any, any>((props, ref) => {
  const translate = useTranslate();
  return (
    <MenuItemLink
      ref={ref}
      to="/configuration"
      primaryText={translate("pos.configuration")}
      leftIcon={<SettingsIcon />}
      onClick={props.onClick}
      sidebarIsOpen
    />
  );
});

const ProfileMenu = forwardRef<any, any>((props, ref) => {
  const translate = useTranslate();

  return (
    <MenuItemLink
      ref={ref}
      to="/profile"
      primaryText={translate("pos.profile")}
      leftIcon={<FaceIcon />}
      onClick={props.onClick}
      sidebarIsOpen
    />
  );
});

const CustomUserMenu = (props: any) => {
  const { profileVersion } = useProfile();

  return (
    <UserMenu key={profileVersion} {...props}>
      <ProfileMenu />
      <ConfigurationMenu />
    </UserMenu>
  );
};

export const CustomAppBar = (props: any) => {
  const classes = useStyles();
  return (
    <AppBar {...props} elevation={1} userMenu={<CustomUserMenu />}>
      <Typography
        variant="h6"
        color="inherit"
        className={classes.title}
        id="react-admin-title" // title is shown here
      />
      <Logo />
      <span
        className={classes.spacer}
        // the profile pic will be rendered by react admin
      />
    </AppBar>
  );
};
