import { Outlet } from "react-router-dom";
import SuperAdminSidebar from '../Sidebar/SuperAdminSidebar'


const Layout = () => {
  return (
    <div className='flex flex-row min-h-screen bg-white'>
        <SuperAdminSidebar/>
          <Outlet />
    </div>
  );
};

export default Layout;