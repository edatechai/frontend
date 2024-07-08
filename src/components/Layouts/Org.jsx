

import { Outlet } from "react-router-dom";
import Org from '../Sidebar/Org' // Adjust the import path as necessary
//import Index from '../Index'; // Ensure this is imported if needed
import Index from '../Nav/Index'

const Layout = () => {
  return (
    <div className='flex flex-row min-h-screen bg-white'>
      <Org/>
      <div className='flex-grow'>
        <Index />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
