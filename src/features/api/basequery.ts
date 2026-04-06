import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { BaseQueryApi } from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";

type ExtraOptions = { navigate?: (path: string) => void };

const mutex = new Mutex();

const getToken = () => localStorage.getItem("Token");

const rawBase = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  },
});

const redirectToLogin = (extraOptions: ExtraOptions) => {
  const authPaths = ["/", "/register"];
  if (!authPaths.includes(window.location.pathname)) {
    const { navigate } = extraOptions;
    if (navigate) {
      navigate("/");
    } else {
      window.location.href = "/";
    }
  }
};

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, ExtraOptions> =
  async (args, api: BaseQueryApi, extraOptions) => {
    // Wait if a token refresh is already in progress
    await mutex.waitForUnlock();

    let result = await rawBase(args, api, extraOptions);

    if (result.error?.status !== 401) {
      return result;
    }

    // Got 401 — attempt a silent token refresh
    if (mutex.isLocked()) {
      // Another request is already refreshing; wait for it then retry
      await mutex.waitForUnlock();
      result = await rawBase(args, api, extraOptions);
      if (result.error?.status === 401) {
        redirectToLogin(extraOptions);
      }
      return result;
    }

    const release = await mutex.acquire();
    try {
      const refreshResult = await rawBase(
        { url: "/api/users/refresh-token", method: "POST" },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { token } = refreshResult.data as { token: string };
        localStorage.setItem("Token", token);
        // Retry the original request with the new token
        result = await rawBase(args, api, extraOptions);
      } else {
        // Refresh failed — clear stored token and redirect
        localStorage.removeItem("Token");
        redirectToLogin(extraOptions);
      }
    } finally {
      release();
    }

    return result;
  };

export default baseQueryWithReauth;
