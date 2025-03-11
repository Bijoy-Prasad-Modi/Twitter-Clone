import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  console.log("Backend URL:", env.VITE_BASE_URL || "http://localhost:5000");
  return {
    plugins: [tailwindcss(), react()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_BASE_URL || "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});

// https://vite.dev/config/
//export default defineConfig({
// plugins: [tailwindcss(), react()],
// server: {
//   historyApiFallback: true, // ✅ Fix refresh issue
//   proxy: {
//     "/api": {
//       target: "${import.meta.env.VITE_BASE_URL}",
//       changeOrigin: true,
//       secure: false,
//     },
//   },
// },
//});
