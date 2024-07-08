// import One from '../src/assets/one.png'
// import { Link, Route, Routes, Navigate } from "react-router-dom";
// import Index from './pages/Autth/Index';
// import TeachersLayout from './components/Layouts/Teacher';
// import Dashboard from './pages/Teacher/Index';
// import SuperAdminLayout from '../src/components/Layouts/SuperAdmin'
// import SuperAdminDashboard from './pages/SuperAdmin/SuperAdmin';
// import OrgLayout from '../src/components/Layouts/Org'
// import OrgDashboard from './pages/Org/Org';
// import StudentLayout from '../src/components/Layouts/Student'
// import StudentDashboard from './pages/Student/Student'
// import ParentLayout from '../src/components/Layouts/Parent'
// import ParentDashboard from './pages/Parent/Parent'

// const  App =()=> {
//   return (
//     <div>
//       <Routes>

//       {/* Teachers layout */}
//       <Route element={<TeachersLayout/>}>
//          <Route path="/teacher" element={<Dashboard />} />
//        </Route>

//        {/* Super Admin layout */}
//        <Route element={<SuperAdminLayout/>}>

//          <Route path="/super-admin" element={<SuperAdminDashboard />} />
//        </Route>

//        {/* Org layout */}
//        <Route element={<OrgLayout/>}>
//          <Route path="/org-admin" element={<OrgDashboard />} />
//        </Route>

//         {/* Student layout */}
//         <Route element={<StudentLayout/>}>
//          <Route path="/student" element={<StudentDashboard />} />
//        </Route>

//          {/* Parent layout */}
//          <Route element={<ParentLayout/>}>
//          <Route path="/parent" element={<ParentDashboard />} />
//        </Route>


//       <Route path="/" element={<Index />} />
//     </Routes>
//     </div>
   
//   )
// }

// export default App

import PrivateRoute from "./PrivateRoute";
import { Routes, Route , Navigate } from "react-router-dom";
import Index from './pages/Autth/Index';
import TeachersLayout from './components/Layouts/Teacher';
import Dashboard from './pages/Teacher/Index';
import SuperAdminLayout from '../src/components/Layouts/SuperAdmin';
import SuperAdminDashboard from './pages/SuperAdmin/SuperAdmin';
import OrgLayout from '../src/components/Layouts/Org';
import OrgDashboard from './pages/Org/Org';
import StudentLayout from '../src/components/Layouts/Student';
import StudentDashboard from './pages/Student/Student';
import ParentLayout from '../src/components/Layouts/Parent';
import ParentDashboard from './pages/Parent/Parent';
import { useCurrentUserQuery } from "./features/api/apiSlice";
import CreateOrg from '../src/pages/SuperAdmin/CreateOrg'
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "./features/user/userSlice";
import Profile from '../src/pages/Profile/Index'
import OrgSettings from '../src/pages/Org/Settings'
import ClassRoom from '../src/pages/ClassRoom/Index'
import SuperAdminSettings from '../src/pages/SuperAdmin/Settings'
import Quiz from '../src/pages/Student/Quiz'


const App = () => {
  const { data: user, error, isLoading } = useCurrentUserQuery();
  const dispatch = useDispatch();
  if(user){
    dispatch(setUserInfo(user));
  }else{
    dispatch(setUserInfo(null));
  }

  console.log("here", error)

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if(!user){

  }

  if (error) {
   // return <div>Error loading user data: {error.message}</div>;
  }

  const userRole = user?.role;

  return (
    <div>
      <Routes>
       {/* Teachers layout */}
       <Route element={<TeachersLayout/>}>
          <Route path="/teacher" element={<Dashboard />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/class-room" element={<ClassRoom/>} />
        </Route>

        {/* Super Admin layout */}
        <Route element={<SuperAdminLayout/>}>
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/dashboard/create-organization" element={<CreateOrg/>} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/settings" element={<SuperAdminSettings />} />
        </Route>

        {/* Org layout */}
        <Route element={<OrgLayout/>}>
          <Route path="/org-admin" element={<OrgDashboard />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/org-settings" element={<OrgSettings />} />
        </Route>

         {/* Student layout */}
         <Route element={<StudentLayout/>}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/class-room" element={<ClassRoom/>} />
          <Route path="/dashboard/quiz" element={<Quiz/>} />


        </Route>

          {/* Parent layout */}
          <Route element={<ParentLayout/>}>
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Default route */}
        {!userRole ? (
          <Route path="/" element={<Index />} />
        ) : (
          <Route path="/" element={<Navigate to={`/${userRole}`} replace />} />
        )}
      </Routes>
    </div>
  );
};

export default App;


// const App = () => {
  
//   return (
//     <div>
//       <Routes>
//         {/* Teachers layout */}
//         <Route
//           element={
//             <PrivateRoute roles={['teacher']}>
//               <TeachersLayout />
//             </PrivateRoute>
//           }
//         >
//           <Route path="/teacher" element={<Dashboard />} />
//         </Route>

//         {/* Super Admin layout */}
//         <Route
//           element={
//             <PrivateRoute roles={['superAdmin']}>
//               <SuperAdminLayout />
//             </PrivateRoute>
//           }
//         >
//           <Route path="/super-admin" element={<SuperAdminDashboard />} />
//         </Route>

//         {/* Org layout */}
//         <Route
//           element={
//             <PrivateRoute roles={['org-admin']}>
//               <OrgLayout />
//             </PrivateRoute>
//           }
//         >
//           <Route path="/org-admin" element={<OrgDashboard />} />
//         </Route>

//         {/* Student layout */}
//         <Route
//           element={
//             <PrivateRoute roles={['student']}>
//               <StudentLayout />
//             </PrivateRoute>
//           }
//         >
//           <Route path="/student" element={<StudentDashboard />} />
//         </Route>

//         {/* Parent layout */}
//         <Route
//           element={
//             <PrivateRoute roles={['parent']}>
//               <ParentLayout />
//             </PrivateRoute>
//           }
//         >
//           <Route path="/parent" element={<ParentDashboard />} />
//         </Route>

//         {/* Default route */}

      
//         <Route path="/" element={<Index />} />
//       </Routes>
//     </div>
//   );
// };

// export default App;




