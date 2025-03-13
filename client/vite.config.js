import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  //const env = loadEnv(mode, process.cwd(), "");

  //console.log("Backend URL:", env.VITE_BASE_URL || "http://localhost:5000");

  // https://vite.dev/config/
  return {
    plugins: [tailwindcss(), react()],
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
        //  secure: false,
        },
      },
    },
  };
});

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
