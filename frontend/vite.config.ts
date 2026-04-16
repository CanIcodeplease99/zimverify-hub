import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 3000,
    hmr: {
      overlay: false,
      clientPort: 443,
    },
    allowedHosts: [
      "zimra-vehicle-hub.cluster-12.preview.emergentcf.cloud",
      "b065e4fd-8e1e-4905-9803-383c13605224.preview.emergentagent.com",
      "localhost",
      ".preview.emergentagent.com",
      ".preview.emergentcf.cloud"
    ],
    watch: {
      usePolling: false,
      interval: 1000,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "placeholder.svg"],
      workbox: {
        navigateFallbackDenylist: [/^\/~oauth/],
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,webp}"],
      },
      manifest: {
        name: "ZimVerify – National Vehicle Verification",
        short_name: "ZimVerify",
        description: "Zimbabwe's trusted vehicle verification platform. Check plates, VINs, and ownership history instantly.",
        theme_color: "#1a5c4c",
        background_color: "#FAF8F5",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "/pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512.png", sizes: "512x512", type: "image/png" },
          { src: "/pwa-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
