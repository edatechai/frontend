import { createListenerMiddleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";

const unauthorizedMiddleware = createListenerMiddleware();

unauthorizedMiddleware.startListening({
  matcher: isRejectedWithValue,
  effect: async (action, listenerApi) => {
    console.log({ action, listenerApi });
    const publicPaths = ["/", "/complete-agent-signup"];
    if (
      (action?.payload?.status === 401 || action?.payload?.status === 400) &&
      !publicPaths.includes(window.location.pathname)
    ) {
      window.location.href = "/";
    }
  },
});

export default unauthorizedMiddleware;
