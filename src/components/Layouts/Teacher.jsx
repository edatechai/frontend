import { Outlet } from "react-router-dom";
import Teacher from '../Sidebar/TeachersSidebar'
import Index from "../Nav/Index";


const Layout = () => {
  return (
    <div className='flex flex-row min-h-screen bg-white'>
    <Teacher/>
    <div className='flex-grow'>
      <Index />
      <Outlet />
    </div>
    </div>
  );
};

export default Layout;