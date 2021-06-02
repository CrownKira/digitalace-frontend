import { useSelector } from 'react-redux';
import { Layout, LayoutProps, Sidebar } from 'react-admin';
import AppBar from './AppBar';
import Menu from './Menu';
import { darkTheme, lightTheme } from './themes';
import { AppState } from '../types';

// qn: why need to name Layout.tsx CustomLayout.tsx
const CustomSidebar = (props: any) => <Sidebar {...props} size={200} />;

const CustomLayout = (props: LayoutProps) => {
  const theme = useSelector((state: AppState) =>
    state.theme === 'dark' ? darkTheme : lightTheme
  );

  return (
    <Layout
      {...props}
      appBar={AppBar}
      sidebar={CustomSidebar}
      menu={Menu}
      theme={theme}
    />
  );
};

export default CustomLayout;
