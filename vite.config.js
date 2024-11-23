import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests starting with "/api" to the backend server (localhost:5000)
      "/api": {
        target: "https://sarvam-mern.onrender.com", // Backend server URL
        changeOrigin: true, // Ensure proper origin handling
        rewrite: (path) => path.replace("/^/api/", ""), // Optionally remove /api prefix
      },
    },
  },
});
