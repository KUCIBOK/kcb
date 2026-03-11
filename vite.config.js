import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// ─────────────────────────────────────────────────────────────────────────────
// MODES DE DÉVELOPPEMENT
//
// Mode A — yarn dev (front seul, proxy → VPS ou vercel dev)
//   VITE_DEV_BACKEND_URL=https://backend.kucibok.com  → proxy vers VPS Express (ancienne stack)
//   VITE_DEV_BACKEND_URL=http://localhost:3000        → proxy vers `vercel dev` (nouvelle stack)
//
// Mode B — vercel dev (recommandé pour tester les Vercel Functions)
//   Lance le front Vite ET les fonctions serverless sur le même port.
//   Le proxy Vite n'est pas utilisé dans ce mode (pas de cross-origin).
//
// Production (Vercel)
//   Le proxy Vite n'est PAS utilisé. Vercel route /api/* → fonctions serverless.
//   Le front consomme les Vercel Functions directement (même domaine).
// ─────────────────────────────────────────────────────────────────────────────

export default defineConfig(({ mode }) => {
  // loadEnv() est requis pour lire les vars .env dans vite.config.js
  // process.env.VITE_* n'est PAS disponible ici sans loadEnv
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      port: 5173,
      proxy: {
        // Dev uniquement — en production Vercel route /api/* vers les fonctions serverless
        "/api": {
          target: env.VITE_DEV_BACKEND_URL || "http://localhost:3000",
          changeOrigin: true,
          secure: false,
          ws: false,
        },
      },
    },
    build: {
      outDir: "dist",
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-supabase': ['@supabase/supabase-js'],
            'vendor-ui': ['framer-motion', 'lucide-react', 'sonner'],
            'vendor-charts': ['chart.js', 'react-chartjs-2'],
          },
        },
      },
    },
  };
});
