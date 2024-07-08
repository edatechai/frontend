import { Outlet } from "react-router-dom";
import Org from '../Sidebar/Org'
import Parent from '../Sidebar/Parent'
import Index from "../Nav/Index";


const Layout = () => {
  return (
    <div className='flex flex-row min-h-screen bg-white'>
    <Parent/>
    <div className='flex-grow'>
      <Index />
      <Outlet />
    </div>
    </div>
  );
};

export default Layout;