import React from "react";
import { useSelector } from "react-redux";
import { Layout, CoreLayoutProps, Sidebar } from "react-admin";
import { CustomAppBar as AppBar } from "./AppBar";
import { Menu } from "./Menu";
import { darkTheme, lightTheme } from "./themes";
import { AppState } from "../types";
import { ProfileProvider } from "../userMenu/profile/Profile";

const CustomSidebar = (props: any) => <Sidebar {...props} size={200} />;

export const CustomLayout = (props: CoreLayoutProps) => {
  const theme = useSelector((state: AppState) =>
    state.theme === "dark" ? darkTheme : lightTheme
  );

  return (
    <ProfileProvider>
      <Layout
        {...props}
        appBar={AppBar}
        sidebar={CustomSidebar}
        menu={Menu}
        theme={theme}
      />
    </ProfileProvider>
  );
};
