import AppLayout from '@cloudscape-design/components/app-layout';
import { Outlet } from 'react-router-dom';
import SideNav from './SideNav';

function Root() {
  return (
    <AppLayout
      toolsHide
      navigation={<SideNav />}
      maxContentWidth={Number.MAX_VALUE}
      content={<Outlet />}
    />
  );
}

export default Root;
