import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      // Dev uniquement — proxy /api → backend local
      // En production, Vercel forwarde /api vers backend.kucibok.com (vercel.json)
      "/api": {
        target: process.env.VITE_DEV_BACKEND_URL || "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        ws: true, // WebSockets (P3-PERF-003 — enchères temps réel)
      },
    },
  },
  build: {
    outDir: "dist",
  },
});
