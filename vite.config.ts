import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: [
      "better-react-mathjax",
      "mathlive",
      "@reduxjs/toolkit/query/react"
    ],
    include: [
      "react-redux",
      "@reduxjs/toolkit"
    ]
  },
  server: {
    fs: {
      strict: false
    }
  }
});
