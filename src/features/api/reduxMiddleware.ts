import { createListenerMiddleware } from "@reduxjs/toolkit";

// 401 redirects are now handled in basequery.ts via the re-auth / token-refresh flow.
// This middleware is kept as a placeholder for other global action listeners.
const unauthorizedMiddleware = createListenerMiddleware();

export default unauthorizedMiddleware;
