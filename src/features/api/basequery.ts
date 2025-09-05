import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { history } from "./path-to-your-history"; // Adjust the path to your history setup

const getToken = () => {
  const token = localStorage.getItem("Token");
  if (!token) {
    console.log({ token });
  }
  return token;
};

const baseQuery = fetchBaseQuery({
  baseUrl: "https://ai.edatech.ai/app",
  
  prepareHeaders: async (headers) => {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  },
});

const baseQueryWithRedirect = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  console.log({ result });
  console.log({ extraOptions });
  if (result?.error?.status === 401) {
    const { navigate } = extraOptions; // Get the navigate function
    if (navigate) {
      console.log("navigate");
      navigate("/");
    }
  }

  return result;
};

export default baseQueryWithRedirect;
