import { Outlet } from "react-router-dom";
import StudentSidebar from "../Sidebar/StudentSidebar";
import Index from "../Nav/Index";


const Layout = () => {
  return (
<div className='flex flex-row min-h-screen bg-white'>
<StudentSidebar/>
<div className='flex-grow'>
  <Index />
  <Outlet />
</div>
</div>
  );
};

export default Layout;