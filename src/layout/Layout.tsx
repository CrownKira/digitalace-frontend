import { useSelector } from 'react-redux';
import { Layout, LayoutProps, Sidebar } from 'react-admin';
import AppBar from './AppBar';
import Menu from './Menu';
import { darkTheme, lightTheme } from './themes';
import { AppState } from '../types';
import { ProfileProvider } from '../profile/Profile';

const CustomSidebar = (props: any) => <Sidebar {...props} size={200} />;

export default (props: LayoutProps) => {
  const theme = useSelector((state: AppState) =>
    state.theme === 'dark' ? darkTheme : lightTheme
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
