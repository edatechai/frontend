

// import { Navigate } from "react-router-dom";
// import { useCurrentUserQuery } from "./features/api/apiSlice";

// // Mock function to get the current user role.
// // Replace this with actual authentication logic.

// const getUserRole = (getuser) => {
//   console.log("data",getuser?.role)
//   const mRole = getuser?.role
//  return `"${mRole}"`;
// // console.log("me check", `"${mRole}"`)
// //  return mRole
// };

// const PrivateRoute = ({ children, roles }) => {
//   const {data:getuser} = useCurrentUserQuery()
//   const userRole = getUserRole(getuser);

//   if (roles.includes(userRole)) {
//     return children; // Render the children if user role is allowed
//   } else {
//     return  <><Navigate to="/" /></>
    
//   }
// };

// export default PrivateRoute;


// import { Navigate } from "react-router-dom";
// import { useCurrentUserQuery } from "./features/api/apiSlice";

// // Function to get user role from fetched user data
// const getUserRole = (user) => {
//   return user?.role ;
// };

// const PrivateRoute = ({ children, roles }) => {
//   // Fetch user data from the API slice
//   const { data: user, error, isLoading } = useCurrentUserQuery();
//   console.log("user", user)

//   // Check for loading state and handle errors
//   if (isLoading) {
//     return <><div>Loading...</div></>
//   }

//   if (error) {
//     return <><div>Error loading user data: {error.message}</div></> 
//   }

//   // Determine user role
//   const userRole = getUserRole(user);

//   // Check if user role is in the allowed roles
//   if (roles.includes(userRole)) {
//     return children; // Render children if user role is allowed
//   } else {
//     return <><Navigate to="/" /></> 
//   }
// };

// export default PrivateRoute;


import { Navigate } from "react-router-dom";
import { useCurrentUserQuery } from "./features/api/apiSlice";

// Function to get user role from fetched user data
const getUserRole = (user) => {
  return user?.role;
};

const PrivateRoute = ({ children, roles }) => {
  // Fetch user data from the API slice
  const { data: user, error, isLoading } = useCurrentUserQuery();
  console.log("user", user)

  // Check for loading state and handle errors
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading user data: {error.message}</div>;
  }

  // Determine user role
  const userRole = getUserRole(user);

  // Check if user role is in the allowed roles
  if (roles.includes(userRole)) {
    return children; // Render children if user role is allowed
  } else {
    return <Navigate to="/" />;
  }
};

export default PrivateRoute;


