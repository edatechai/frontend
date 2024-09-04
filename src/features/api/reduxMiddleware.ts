import { createListenerMiddleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";

const unauthorizedMiddleware = createListenerMiddleware();

unauthorizedMiddleware.startListening({
  matcher: isRejectedWithValue,
  effect: async (action, listenerApi) => {
    console.log({ action, listenerApi });
    if (
      (action?.payload?.status === 401 || action?.payload?.status === 400) &&
      window.location.pathname != "/"
    ) {
      window.location.href = "/";
    }
  },
});

export default unauthorizedMiddleware;
