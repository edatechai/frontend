import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { BaseQueryApi } from "@reduxjs/toolkit/query";

type ExtraOptions = { navigate?: (path: string) => void };
// import { history } from "./path-to-your-history"; // Adjust the path to your history setup

const getToken = () => {
  const token = localStorage.getItem("Token");
  return token;
};

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: async (headers) => {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  },
});

const baseQueryWithRedirect: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, ExtraOptions> = async (args, api: BaseQueryApi, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const { navigate } = extraOptions;
    const authPaths = ["/", "/register"];
    if (navigate && !authPaths.includes(window.location.pathname)) {
      navigate("/");
    }
  }

  return result;
};

export default baseQueryWithRedirect;
